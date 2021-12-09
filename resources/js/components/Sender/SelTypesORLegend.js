import React from "react";
import {Col, Container, Row} from "reactstrap";
import {Checkbox} from "./Checkbox";


function Legend_elements(props) {
    return(
        <Container className="ml-2">
            {
                Array.from(Array(props.row_number).keys()).map(row =>
                    <Row key={row}>
                        {
                            props.elements_key.slice(row * props.num_col, (row + 1) * props.num_col).map
                            (elem =>
                                props.opt === '1' ?
                                    <Checkbox
                                        key   = {'cb' + elem}
                                        name  = "components"
                                        value = {elem}
                                        color = {props.elem_colors[elem]}/> :
                                    <Col
                                        xs  = {12} sm={4} md={4} lg={4}
                                        key = {'lb'+elem}
                                    ><label style={{color:props.elem_colors[elem]}}>{elem}</label>
                                    </Col>
                            )
                        }
                    </Row>
                )
            }
        </Container>
    )
}


export class SelTypesORLegend extends React.Component {
    constructor(props) {
        super(props);
    }

    get_legend_value = (opt) => {
        switch (opt) {
            case "1": return "Biological elements Type";
            case "2": return "Legend";
            case "3": return "Node Legend"
        }
    };

    render() {
        const nodes_key  = Array.from(Object.keys(this.props.colors));
        const edges_key  = Array.from(Object.keys(this.props.colors_edge));

        const nodes_row_number = Math.ceil(nodes_key.length/this.props.num_col);
        const edges_row_number = Math.ceil(edges_key.length/this.props.num_col);

        const opt = this.props.values;

        return(
            <React.Fragment>
                <React.Fragment>
                    <legend> {this.get_legend_value(opt)}</legend>
                    <Legend_elements
                            row_number   = {nodes_row_number}
                            elements_key = {nodes_key}
                            num_col      = {this.props.num_col}
                            elem_colors  = {this.props.colors}
                            opt          = {opt}
                    />
                </React.Fragment>
                {
                    opt === '3' ?
                        <React.Fragment>
                            <br/>
                            <legend>Edge Legend</legend>
                            <Legend_elements
                                row_number   = {edges_row_number}
                                elements_key = {edges_key}
                                num_col      = {this.props.num_col}
                                elem_colors  = {this.props.colors_edge}
                                opt          = {opt}
                            />
                        </React.Fragment> : null
                }
            </React.Fragment>
        );
    }
}
