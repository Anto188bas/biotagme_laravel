import React from 'react'

import "/home/vagrant/biotagme_laravel/public/css/material.css";
import "/home/vagrant/biotagme_laravel/public/css/material1.css";
import "/home/vagrant/biotagme_laravel/public/css/material3.css";
import {Progress} from "reactstrap";
import axios from 'axios';

export default class Uploader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file_list:null,
            value_list:[],
            chunk_size: 2 * 1024 * 1024,
            chunk_number:0
        };
        this.onchange = this.onchange.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
        //this.onUpdateItem = this.onUpdateItem.bind(this);
    }

    onUpdateItem = (i, percentage) =>{
        let new_list = this.state.value_list.map((el, idx) =>
            idx === i ? percentage : el
        );
        this.setState( {value_list: new_list})
    };

    onchange = (e) => {
       this.setState({
           file_list: e.target.files,
           value_list: new Array(e.target.files.length).fill(0)
       });
    };

    onsubmit = () => {
       const sts = this.state;
       Array.from(sts.file_list).map((file,i) => {
           const file_size   = file.size;
           const totalChunks = Math.ceil(file_size / sts.chunk_size);
           this.uploader(file, i, this, file_size, totalChunks).catch(e => console.log(e))
       });
    };

    async uploader(file, i, this_class, file_size, totalChunks) {
        // Parameters
        const chunkNumber = this_class.state.chunk_number;
        const start = this_class.state.chunk_size * chunkNumber;
        const end = Math.min(file_size, start + this_class.state.chunk_size);
        const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

        // The follows line of code define the body of the request
        let params = new FormData();
        params.append('chunk', chunkNumber);
        params.append('chunks', totalChunks);
        params.append('file', file.slice(start, end), file.name);

        await wait(500);
        axios.post("/api/uploadCSV", params, {
                'headers': {
                    'Authorization': 'Bearer ' + this_class.props.token,
                    'Accept': 'application/json',
                }
            }).then(function (response) {
                if (response.status === 200) {
                    if (response.data.finished !== true) {
                        const new_percentage = parseInt(end / file_size * 100, 10);
                        this_class.onUpdateItem(i, new_percentage);
                        this_class.setState({chunk_number: this_class.state.chunk_number + 1});
                        this_class.uploader(file, i, this_class, file_size, totalChunks);
                    } else {
                        this_class.onUpdateItem(i, 100);
                    }
                }
                else {console.log(response)}
            }).catch(function (err) {
                console.log(err)
            })
    }

    render() {
        return (
           <div>
              <form>
                 <div className="e-upload e-control-wrapper e-lib e-keyboard">
                    <br/>
                    <div className="input-group">
                        <div className="custom-file">
                            <input type="file" multiple={true} className="custom-file-input" onChange={this.onchange}
                                   aria-describedby="inputGroupFileAddon01"/>
                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                        </div>
                    </div>
                    <br/>
                    <ul className="e-upload-files">
                        {
                           this.state.file_list != null ?
                               Array.from(this.state.file_list).map((file,i) =>
                                   <li className="e-upload-file-list" key={i}>
                                       <span className="e-file-container">
                                            <span className="e-file-name" title={file.name}>{file.name}</span>
                                       </span>
                                       <Progress bar value={this.state.value_list[i]} max={100}>
                                           {this.state.value_list[i]}
                                       </Progress>
                                   </li>
                           ) : null
                        }
                    </ul>
               </div>
               <br/>
               <button className="btn btn-success" type="button" onClick={this.onsubmit}>Upload</button>
            </form>
        </div>
        )
    }
}
