import React from 'react'
import {Col, Input, Row} from "reactstrap";
import {Error} from "../Error/Error";

export class SenderInput extends React.Component {
    constructor(props) {
        super(props);
        this.components  = Array('GENE','PROTEIN','DISEASE','miRNA','LNC','mRNA','DRUG', 'PATHWAY', "ENZYME");
    }

    render() {
        return(
            <div>
            {
                this.props.opt !== '3' ?
                    <React.Fragment>
                        <h5 className="my_label_color">Biological element name</h5>
                        {Array.from(Array(parseInt(this.props.opt)).keys()).map(idx =>
                            <React.Fragment key={idx}>
                                <Row>
                                    <Col sm={5}>
                                        <Input
                                            type     = {"select"}
                                            name     = {"select" + (idx + 1).toString()}
                                            id       = {this.props.opt + "_elementSelect_" + (idx + 1).toString()}
                                            value    = {this.props.values["select" + (idx + 1).toString()]}
                                            onChange = {this.props.handler}
                                        > {this.components.map(element => <option key={element}>{element}</option> )}
                                        </Input>
                                    </Col>
                                    <Col sm={7}>
                                        <Input
                                            type        = {"text"}
                                            name        = {"bioElem" + (idx + 1).toString()}
                                            id          = {this.props.opt + "_biologyText_" + (idx + 1).toString()}
                                            value       = {this.props.values["bioElem" + (idx + 1).toString()]}
                                            onChange    = {this.props.handler}
                                            placeholder = {"Biological Element name"}
                                        />
                                    </Col>
                                </Row>
                                {this.props.errors["bioElem" + (idx + 1).toString()] ?
                                    <Error message={this.props.errors["bioElem" + (idx + 1).toString()]}/> : null
                                }
                                {parseInt(this.props.opt) -1 > idx ? <br/> : null}
                            </React.Fragment>
                        )}
                    </React.Fragment>:
                    <React.Fragment>
                        <legend>Cypher query</legend>
                        <Input type        = "textarea"
                               name        = "query"
                               id          = "queryText"
                               placeholder = "Complete Cypher query"
                               value       = {this.props.values.query}
                               onChange    = {this.props.handler}
                        />
                        {this.props.errors.query ? <Error message = {this.props.errors.query} /> : null}
                    </React.Fragment>
            }
            </div>
        )
    }
}
