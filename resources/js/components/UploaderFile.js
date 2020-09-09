import React from 'react'
import "../../../public/css/material.css";
import "../../../public/css/material1.css";
import "../../../public/css/material3.css";
import {Container, Card, CardText, CardTitle, Progress} from "reactstrap";
import axios from 'axios';
import {FileLoaderState} from "./FileLoaderState";

export default class Uploader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file_list     :  [],
            chunk_size    :  2 * 1024 * 1024,
            chunk_number  :  0,
            error         :  false
        };
        this.refs_map       = new Map();
        this.already_loaded = 0;
        this.message        = "internal_error";
        this.onchange       = this.onchange.bind(this);
        this.onsubmit       = this.onsubmit.bind(this);
        this.end_load_files = this.end_load_files.bind(this);
        this.error_block    = this.error_block.bind(this);
    }


    error_block = () => {
        return(
            <div>
                <p className = "text-danger">
                    {this.message}
                </p>
            </div>
        );
    };


    check_selected_files = () => {
        const required_network_files = ["Nodes", "Edges"];
        const required_mysql_files   = ["Titles", "Aliases", "BioIDs_WikiIDs"];

        let mysql_count = 0, neo4j_count = 0;

        Array.from(this.state.file_list).forEach( file => {
            const file_name = file.name.toLowerCase();
            let   isMysql   = true;
            for(let i=0; i<required_network_files.length; i++){
                if(file_name.includes(required_network_files[i].toLowerCase())){
                   neo4j_count++;
                   isMysql = false;
                   break;
                }
            }
            if(isMysql){
                for(let i=0; i<required_mysql_files.length; i++){
                    if(file_name.includes(required_mysql_files[i].toLowerCase())){
                        mysql_count++;
                        break;
                    }
                }
            }
        });
        let message = "";
        if(mysql_count !== 0 && required_mysql_files.length > mysql_count)
            message += "The files containing Wiki titles, aliases and BioID-WikiID associations are all required..\n";
        if(neo4j_count !== 0 && required_network_files.length > neo4j_count)
            message += "The files containing the Graph Nodes and Edges are both required.";
        if(message !== ""){
           this.setState({error:true});
           this.message = message;
           return false;
        }

        return true;
    };


    reset = () => {
        this.setState({
            file_list    : [],
            chunk_number :  0,
            error        : false
        });
        this.refs_map        = new Map();
        this.already_loaded  = 0;
        this.message         = "internal_error"
    };


    end_load_files = () => {
        if(this.already_loaded === this.state.file_list.length){
           this.props.changeTab('3');
           this.reset()
        }
    };


    onchange = (e) => {
       this.setState({
           file_list  : e.target.files,
           error      :  false
       });

       Array.from(Array(e.target.files.length).keys()).forEach(
           (idx) => this.refs_map.set(idx, React.createRef())
       );

       this.message = "internal_error"
    };


    onsubmit = () => {
       const sts        = this.state;
       const isLoadable = this.check_selected_files();
       if(isLoadable)
           Array.from(sts.file_list).map((file,i) => {
               const totalChunks = Math.ceil(file.size / sts.chunk_size);
               this.uploader(file, i, this, totalChunks)
                   .catch(e => {
                       console.log(e);
                       this.setState({error:true});
                   })
           });
    };


    async uploader(file, i, this_class, totalChunks) {
        // Parameters
        const file_size   = file.size;
        const chunkNumber = this_class.state.chunk_number;
        const start       = this_class.state.chunk_size * chunkNumber;
        const end         = Math.min(file_size, start + this_class.state.chunk_size);
        const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

        // The follows line of code define the body of the request
        let params = new FormData();
        params.append('chunk',  chunkNumber);
        params.append('chunks', totalChunks);
        params.append('file',   file.slice(start, end), file.name);

        await wait(350);
        axios.post("/api/uploadCSV", params, {
             'headers':
                 {
                    'Authorization'  :   'Bearer ' + this_class.props.token,
                    'Accept'         :   'application/json',
                 }
           }).then(function (response) {
                if (response.status === 200) {
                    if (response.data.finished !== true)
                    {
                        this_class.refs_map.get(i).current.change_file_state(parseInt(end / file_size * 100, 10));
                        this_class.setState({chunk_number: this_class.state.chunk_number + 1});
                        this_class.uploader(file, i, this_class, totalChunks);
                    }
                    else
                    {
                        this_class.props.addPaths(response.data.path);
                        this_class.already_loaded ++;
                        this_class.refs_map.get(i).current.change_file_state(100);
                        this_class.end_load_files();

                        console.log(this_class.already_loaded);
                    }
                }
                else {
                    console.log(response);
                    this_class.setState({error:true});
                }
           }).catch(err => {
                console.log(err);
                this_class.setState({error:true});
           })
    }


    render() {
        return (
           <div>
              <form>
                  <Container>
                     <div className="input-group">
                          <div className="custom-file">
                             <input  type      = "file"
                                     multiple  = {true}
                                     className = "custom-file-input"
                                     onChange  = {this.onchange}
                                     aria-describedby = "inputGroupFileAddon01"
                             />
                             <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                          </div>
                     </div>
                  </Container>
                  <br/>
                  { this.state.error !== false ? this.error_block() : null }
                  <br/>
                  <div>
                      <React.Fragment>
                        {
                            this.state.file_list.length !== 0 ?
                                Array.from(this.state.file_list).map((file,i) =>
                                      <FileLoaderState key={i} file={file} ref={this.refs_map.get(i)}/>
                                ) : null
                        }
                      </React.Fragment>
                  </div>
                  <br/>
                      {
                          this.state.file_list.length !== 0 ?
                              <button
                                  className = "btn btn-success"
                                  type      = "button"
                                  onClick   = {this.onsubmit}
                              >
                                  Upload
                              </button> : null
                      }
            </form>
        </div>
        )
    }
}
