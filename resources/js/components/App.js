import React from "react";
import {Container, Col, Row} from "reactstrap";
import BioElemSearch from "./BioElemSearch";
import ReactDOM from "react-dom";

import "/home/vagrant/biotagme_laravel/public/css/material.css";
import "/home/vagrant/biotagme_laravel/public/css/material1.css";
import "/home/vagrant/biotagme_laravel/public/css/material3.css";
import "/home/vagrant/biotagme_laravel/public/css/siderbar.css";
import {CytoNet} from "./CytoNet";

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
            <Container className='container1'>
                <Row>
                    <Col/>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={4}>
                        <BioElemSearch nodes={this.setNodes}/>
                    </Col>
                    <Col id='test' xs={12} sm={12} md={6} lg={8}>
                        <CytoNet nodes={this.state.nodes} />
                    </Col>
                </Row>
                    <Col/>
                <Row/>
            </Container>
        );
    }
}

if(document.getElementById('app_div')){
    ReactDOM.render(<App />, document.getElementById('app_div'));
}
