import React                   from 'react';
import {SelTypesORLegend}      from "./SelTypesORLegend";
import {Table}                 from 'reactstrap';
import {Active_Node}           from "./Active_Node";


export class ResultsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state    = {nodes:[]};
    }

    set_node = (nodes) => {
        this.setState({nodes:nodes});

    };

    render() {
        return(
            <React.Fragment>
                <SelTypesORLegend
                    num_col     = {3}
                    values      = {this.props.values}
                    colors      = {this.props.colors}
                    colors_edge = {this.props.colors_edges}
                />
                <br/>
                {
                    this.state.nodes.length !== 0 ?
                    <React.Fragment>
                    <legend> Nodes List </legend>
                    <div style={{
                        maxHeight: '250px',
                        overflowY: 'auto'
                    }}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Element Name</th>
                                    <th>State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.nodes.map((value, idx) =>
                                        <tr key={idx}>
                                            <th scope="row">{idx}</th>
                                            <td style={{color:this.props.colors[value['type']]}}>{value["label"]}</td>
                                            <td>
                                                <Active_Node
                                                    id_node    = {value['id']}
                                                    state_mode = {this.props.state_node}
                                                />
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                    </React.Fragment> : null
                }
            </React.Fragment>
        )
    }
}
