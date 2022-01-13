import React, {Component} from 'react';
import { Card, Button, CardText, CardTitle} from 'reactstrap';
import axios from 'axios';

export default class ImportDB extends Component {
    constructor(props) {
        super(props);
        this.state      =  {
            isLoader_run: false,
            error:        false
        };
        this.mysql_req  =  Array("Titles","Aliases","BioIDs_WikiIDs", "pmid");
        this.neo4j_req  =  Array("Nodes", "Edges");
    }


    select_appropriate_vector = (file_path) => {
        let db_sel = -1;
        this.mysql_req.forEach(elem => {
            if(file_path.toLowerCase().includes(elem.toLowerCase())){
               db_sel = 0;
               return true;
            }
        });
        if(db_sel === -1) {
            this.neo4j_req.forEach(elem => {
                if (file_path.toLowerCase().includes(elem.toLowerCase())){
                    db_sel = 1;
                    return true;
                }
            })
        }
        return db_sel;
    };


    onclick = () => {
        const this_cls  = this;
        let mysql_files = Array();
        let neo4j_files = Array();

        Array.from(this_cls.props.paths()).map((path, i) => {
            const db_sel = this.select_appropriate_vector(path);
            db_sel === 0 ? mysql_files.push(path) : neo4j_files.push(path)
        });

        let params = new FormData();
        params.append('mysql_paths', mysql_files);
        params.append('neo4j_paths', neo4j_files);
        axios.post("/searching/api/importCSV", params, {
            'headers': {
                'Authorization': 'Bearer ' + this_cls.props.token,
                'Accept': 'application/json',
            }
        }).then(response => {
            this.setState({isLoader_run: true});
        }).catch(error =>{
            this.setState({error:true});
            console.log(error)
        })

    };

    render() {
        return(
            <div>
                <React.Fragment>
                    {!this.state.isLoader_run ?
                        <Card body>
                            <CardTitle>CSV files that will be imported into MYSQL DB:</CardTitle>
                            <ul>
                                {
                                    this.props.paths() != null ?
                                        Array.from(this.props.paths()).map((path, i) =>
                                            <li key={i}>{path.split('/').slice(-1).pop()}</li>
                                        ) : null
                                }
                            </ul>
                            <button className="btn btn-success" type="button" onClick={this.onclick}>Import</button>
                        </Card> :
                        <p>
                            A successful or error notification will be received after each single import
                            operation is completed.
                        </p>
                    }
                </React.Fragment>
                {
                    this.state.error ?
                        <div>
                            <p className="text-danger">
                                Internal Error
                            </p>
                        </div> : null
                }
            </div>
        )
    }
}
