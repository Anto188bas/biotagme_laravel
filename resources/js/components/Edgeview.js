import React, {Component} from "react";
import { Table, Card, CardBody, CardHeader, PaginationItem, PaginationLink, Pagination} from 'reactstrap';

export class Edgeview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_net: [],
            page:       0,
            pageSize:   4
        };
        this.from = "";
        this.to   = "";
        this.uri  = 'http://en.wikipedia.org/?curid=';
    }

    renderTableData = () => {
        const start =  this.state.pageSize * this.state.page;
        const tmp   =  this.state.pageSize * (this.state.page + 1);
        const stop  =  Math.min(this.state.total_net.length, tmp);
        return(
            this.state.total_net.slice(start,stop).map((row, id) =>{
                const {name1, name2, wid1, wid2, btg_score, str_score} = row;
                return(
                    <tr key={id}>
                        <td scope="row"/>
                        <td><a href={this.uri + wid1} target="_blank">{wid1}</a></td>
                        <td><a href={this.uri + wid2} target="_blank">{wid2}</a></td>
                        <td>{btg_score}</td>
                        <td>{str_score}</td>
                    </tr>
                )
            })
        )
    };

    renderTableHeader = () => {
        return(
            <tr>
                <th>#</th>
                <th>Wiki id 1</th>
                <th>Wiki id 2</th>
                <th>Biotagme score</th>
                <th>String score</th>
            </tr>
        )
    };

    updateNet = (update_net) => {
        this.from = update_net[0];
        this.to = update_net[1];
        this.setState({
            total_net: update_net[2],
            page:0,
        });
    };

    closePopper = () => {
        document.getElementById('card-edge').style.visibility = 'hidden'
    };

    render() {
        const pages = Math.ceil(this.state.total_net.length / this.state.pageSize);
        const paginationItems = Array(pages).fill('').map((i, index) =>(
            <PaginationItem key={index} active={this.state.page === index}>
                <PaginationLink tag="button" onClick={() => this.setState({page: index })}>{index + 1}</PaginationLink>
            </PaginationItem>
        ));
        return(
            <Card>
                <CardHeader>
                    Relationship from {this.from} to {this.to}
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
                            {this.state.total_net.length > 0 ? this.renderTableData():null}
                        </tbody>
                    </Table>
                    <nav>
                        <Pagination>
                            <PaginationItem onClick={() => {
                                if(this.state.page < (this.state.total_net.length/this.state.pageSize) - 1)
                                    this.setState(prev => ({page: prev.page + 1}))}
                            }>
                                <PaginationLink next tag="button">
                                    Next
                                </PaginationLink>
                            </PaginationItem>
                            {paginationItems}
                            <PaginationItem onClick={() => {
                                if(this.state.page > 0)
                                    this.setState(prev => ({page: prev.page -1}))}
                            }>
                                <PaginationLink>
                                    Back
                                </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </nav>
                </CardBody>
            </Card>
        );
    }

}
