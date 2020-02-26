import React from "react";
import {Container, Col, Row, Table} from "reactstrap";
import BioElemSearch from "./BioElemSearch";
import ReactDOM from "react-dom";

import "/home/vagrant/biotagme_laravel/public/css/material.css";
import "/home/vagrant/biotagme_laravel/public/css/material1.css";
import "/home/vagrant/biotagme_laravel/public/css/material3.css";

export default class App extends React.Component {

    path = {saveUrl: '/api/uploadCSV'};

    render() {
        return(
            <Container>
                <Row>
                    <Col/>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={4}>
                        <BioElemSearch />
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
