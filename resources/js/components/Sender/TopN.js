import React from "react";
import {Input} from "reactstrap";

export class TopN extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <React.Fragment>
                <legend>Top n</legend>
                <Input
                    type     = "select"
                    name     = "top_n"
                    value    = {this.props.values.top_n}
                    onChange = {this.props.handler}
                >
                    {
                        Array.from(Array(this.props.max_opt).keys()).map(
                            (v,idx) => <option key={idx}>{(v+1) * 10}</option>
                        )
                    }
                </Input>
            </React.Fragment>
        );
    }
}
