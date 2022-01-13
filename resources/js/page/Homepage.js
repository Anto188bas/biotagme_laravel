import React                                                from "react";
import {Container, Row, Col, Navbar, Nav, NavItem, NavLink} from 'reactstrap';
import AuthorTable                                          from "../components/Tables/AuthorTable";
import {NavLink as RouterNavLink }                          from 'react-router-dom';

import "../../../public/css/material.css";
import "../../../public/css/material1.css";
import "../../../public/css/material3.css";
import "../../../public/css/siderbar.css";


const MyNavLink = ({ href, children, ...props }) => {
    return <RouterNavLink to={href} {...props}>{children}</RouterNavLink>;
};

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="homepage">
                <header className='trapezoid'>
                    <Navbar light expand="md">
                        <Nav className='ml-auto'>
                            <NavItem>
                                <NavLink href="/searching" tag={MyNavLink}>Searching</NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <h1 className='p-2'>BioTAGME</h1>
                    <h3 className='p-2'>A comprehensive platform for biological knowledge network analysis</h3>
                </header>
                <main>
                    <div className='abstract abstract_pd'>
                        <Container>
                            <Row><Col>
                            The inference of novel knowledge and generation of new hypotheses from the current literature analysis
                            is a fundamental process in making new scientific discoveries together with gaining knowledge about
                            relationships among biological elements. Especially in bio-medicine, given the enormous amount of
                            literature and knowledge bases available, this approach could enable to rapidly infer knowledge
                            about aspects widely investigated by others researchers. Therefore, the automatic knowledge
                            extraction in form of semantically related terms (or entities) is rising novel research challenges.
                            In that regard, we propose BioTAGME framework which combines
                            <a className="p-1" href="https://tagme.d4science.org/tagme/" target="_blank">TAGME</a>  annotation framework based on
                            Wikipedia corpus, with <a href="https://alpha.dmi.unict.it/dtweb/dthybrid.php" target="_blank">DT-Hybrid</a> methodology.
                            The aim of this integration is to extract biological terms from scientific documents' title and
                            abstract available in <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank">PubMed</a>, and then predicts
                            possible relationships in order to generate a knowledge graph in an off-line manner.
                            The framework consists of a back-end and a front-end.
                            The back-end is entirely implemented in Scala, and it is ran on a Spark clusters to distribute
                            the computing among several machines. The front-end has been releases through Laravel framework
                            in connection with Neo4j graph database to store the knowledge graph.
                            </Col></Row>
                            <Row className='pt-4'><Col><h3>Authors</h3></Col></Row>
                            <Row className='pt-2'>
                                <Col>
                                    <h5>
                                        <a href="https://www.unict.it/en" target="_blank">University of Catania</a>
                                    </h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <AuthorTable type={1}/>
                                </Col>
                            </Row>
                            <Row className='pt-2'>
                                <Col>
                                    <h5>
                                        <a href="https://www.unipi.it/index.php/english" target="_blank">University of Pisa</a>
                                    </h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <AuthorTable type={2}/>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </main>
                <footer className='mt-auto py-3'><h4>Copyright Di Maria A.</h4></footer>
            </div>
        )
    }
}
