import React, {Component} from 'react';
import { Card, Button, CardText, CardTitle} from 'reactstrap';
import axios from 'axios';

export default class ImportDB extends Component {

    constructor(props) {
        super(props);
    }

    onclick = () => {
        const this_cls = this;
        // delete map function in order to ensure that the element will be processed in a sequential way
        Array.from(this_cls.props.paths()).map((path, i) => {
            let params = new FormData();
            params.append('path', path);
            axios.post("/api/importCSV", params, {
                'headers': {
                    'Authorization': 'Bearer ' + this_cls.props.token,
                    'Accept': 'application/json',
                }
            }).then(response => {
                console.log(response);
                //this_cls.props.resetPath();
                //this_cls.props.changeTab('2');
            }).catch(error => console.log(error))
        })
    };

    render() {
        return(
            <div>
                <Card body>
                    <CardTitle>CSV files that will be imported into MYSQL DB:</CardTitle>
                        <ul>
                            {
                                this.props.paths() != null ?
                                    Array.from(this.props.paths()).map((path, i) =>
                                        <li key={i}>
                                           {path.split('/').slice(-1).pop()}
                                        </li>
                                ) : null
                            }
                        </ul>
                    <button className="btn btn-success" type="button" onClick={this.onclick}>Import</button>
                </Card>
            </div>
        )
    }
}
