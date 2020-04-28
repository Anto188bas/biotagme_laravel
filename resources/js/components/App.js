import React from "react";
import {Container, Col, Row} from "reactstrap";
import BioElemSearch from "./BioElemSearch";
import ReactDOM from "react-dom";
import {CytoNet} from "./CytoNet";
import {Header} from "./Header";
import "../../../public/css/material.css";
import "../../../public/css/material1.css";
import "../../../public/css/material3.css";
import "../../../public/css/siderbar.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: []
        };
        this.setNodes = this.setNodes.bind(this);
    }

    setNodes = (n_list) => {
        this.setState({nodes:n_list})
    };

    render() {
        return(
            <div className='app'>
                <Header/>
                <main>
                     <Row className="h-100 mr-1 ml-1">
                         <Col xs={12} sm={12} md={12} lg={5} xl={4} className='mt-3 mb-3'>
                            <BioElemSearch nodes={this.setNodes}/>
                         </Col>
                         <Col id='cypher_box' xs={12} sm={12} md={12} lg={7} xl={8} className='cell-cypher mt-3 mb-3'>
                             <CytoNet nodes={this.state.nodes}/>
                         </Col>
                     </Row>
                </main>
                <footer className='mt-auto py-3'>Copyright</footer>
            </div>
            );
    }
}

if(document.getElementById('app_div')){
    ReactDOM.render(<App />, document.getElementById('app_div'));
}
