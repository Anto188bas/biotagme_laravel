import React from "react";
import {Col, Container, Row} from "reactstrap";
import {Checkbox} from "./Checkbox";

export class SelTypesORLegend extends React.Component {
    constructor(props) {
        super(props);
        this.components  = Array('GENE','PROTEIN','DISEASE','miRNA','LNC','mRNA','DRUG', 'PATHWAY');
    }

    render() {
        const rows_number = Math.ceil(this.components.length/this.props.num_col);
        const rows_id     = Array.from(Array(rows_number).keys());
        return(
            <React.Fragment>
                <legend> {this.props.values.nav_tab === '1' ? "Biological elements Type" : "Legend"} </legend>
                <Container className="ml-2">
                    {
                        rows_id.map(row =>
                            <Row key={row}>
                                {
                                    this.components.slice(row * this.props.num_col, (row + 1) * this.props.num_col).map
                                    (elem =>
                                        this.props.values.nav_tab === '1' ?
                                            <Checkbox
                                                key   = {'cb' + elem}
                                                name  = "components"
                                                value = {elem}
                                                color = {this.props.colors[elem]}/> :
                                            <Col
                                                xs  = {12} sm={4} md={4} lg={4}
                                                key = {'lb'+elem}
                                            ><label style={{color:this.props.colors[elem]}}>{elem}</label>
                                            </Col>
                                    )
                                }
                            </Row>
                        )
                    }
                </Container>
            </React.Fragment>
        );
    }
}
