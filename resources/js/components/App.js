import React                 from "react";
import {Container, Col, Row} from "reactstrap";
import BioElemSearch         from "./Sender/BioElemSearch";
import ReactDOM              from "react-dom";
import {CytoNet}             from "./CytoNet";
import {Header}              from "./Header";
import "../../../public/css/material.css";
import "../../../public/css/material1.css";
import "../../../public/css/material3.css";
import "../../../public/css/siderbar.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state         = {edges: []};
        this.biosearch_ref = React.createRef();
        this.cyto_ref      = React.createRef();
        this.colors        = {
            "GENE"  : "navy",       "PROTEIN" : "orange",     "DISEASE" : "#1b5e20",
            "miRNA" : "blue",       "LNC"     : "maroon",     "mRNA"    : "#757575",
            "DRUG"  : "red",        "PATHWAY" : "purple",     "ENZYME"  : "#16A085"
        };
        this.colors_edges  = {"BioTG": "red", "STRING": "green", "LITERATURE": "orange"};
        this.setEdges      = this.setEdges.bind(this);
    }

    setEdges = (n_list) => {this.setState({edges:n_list})};
    setNodes = (nodes)  => {this.biosearch_ref.current.set_manager_nodes(nodes)};
    change_node_state = (id_node, flag) => {
        this.cyto_ref.current.manage_node(id_node, flag)
    };

    render() {
        return(
            <div className='app'>
                <Header/>
                <main>
                     <Row className="h-100 mr-1 ml-1">
                         <Col xs={12} sm={12} md={12} lg={5} xl={4} className='mt-3 mb-3'>
                            <BioElemSearch
                                edges        = {this.setEdges}
                                edges_list   = {this.state.edges}
                                colors       = {this.colors}
                                colors_edges = {this.colors_edges}
                                nav_pos      = {this.state.edges.length === 0 ? '1':'3'}
                                state_node   = {this.change_node_state}
                                ref          = {this.biosearch_ref}
                            />
                         </Col>
                         <Col id='cypher_box' xs={12} sm={12} md={12} lg={7} xl={8} className='cell-cypher mt-3 mb-3'>
                             <CytoNet
                                 edges        = {this.state.edges}
                                 colors       = {this.colors}
                                 colors_edges = {this.colors_edges}
                                 set_nodes    = {this.setNodes}
                                 ref          = {this.cyto_ref}
                             />
                         </Col>
                     </Row>
                </main>
                <footer className='mt-auto py-3'>Copyright Di Maria A. </footer>
            </div>
            );
    }
}

if(document.getElementById('app_div')){
    ReactDOM.render(<App />, document.getElementById('app_div'));
}
