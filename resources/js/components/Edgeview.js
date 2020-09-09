import React, {Component} from "react";
import { Table, Card, CardBody, CardHeader, PaginationItem, PaginationLink, Pagination} from 'reactstrap';
import {WikiPages} from "./WikiPages";

export class Edgeview extends Component {
    constructor(props) {
        super(props);
        this.state = {info_edge: null};
        this.max_name_len = 20;
    }

    truncated_name  = (name) => {
        return name.length > this.max_name_len ? name.substring(0,this.max_name_len - 1) + "..": name
    };

    renderTableData = () => {
        return(
            <tr>
                <td scope="row"/>
                <td>{this.truncated_name(this.state.info_edge['node1']['name'])}</td>
                <td>{this.truncated_name(this.state.info_edge['node2']['name'])}</td>
                <td>{this.state.info_edge['btg_score']}</td>
                <td>{this.state.info_edge['str_score']}</td>
            </tr>
        )
    };

    renderTableHeader = () => {
        const header = Array("#", "Name 1", "Name 2", "BTG SCORE", "STR SCORE");
        return(
            <tr>
                {header.map((val,idx) => <th key={idx}>{val}</th>)}
            </tr>
        )
    };

    updateNet = (update_net) => {
        this.setState({
            info_edge: update_net[0],
            page:0,
        });
    };

    closePopper = () => {document.getElementById('card-edge').style.visibility = 'hidden'};

    render() {
        return(
            <Card>
                <CardHeader>
                    Relationship
                    <button type="button" className="close" aria-label="Close" onClick={this.closePopper}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </CardHeader>
                <CardBody>
                    <Table striped bordered>
                        <thead>
                            {this.renderTableHeader()}
                        </thead>
                        <tbody>
                            {this.state.info_edge != null ? this.renderTableData():null}
                        </tbody>
                    </Table>
                    <br/>
                    <WikiPages info_edge={this.state.info_edge}/>
                </CardBody>
            </Card>
        );
    }

}
