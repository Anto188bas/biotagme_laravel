import React, {Component} from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Login from "./Authentication";
import Uploader from "./UploaderFile";
import ImportDB from "./ImportTable";

export default class NavUploader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            api_token: '',
            paths: []
        };
        this.setToken   = this.setToken.bind(this);
        this.toggle     = this.toggle.bind(this);
        this.addPath    = this.addPath.bind(this);
        this.getPaths   = this.getPaths.bind(this);
        this.resetPaths = this.resetPaths.bind(this);
    }

    // function used to update the api-token and show the uploader csv component
    setToken = (new_token) => {
        this.setState({
            api_token: new_token
        })
    };

    // function used to change the tab
    toggle = tab => {
        if(this.state.activeTab !== tab)
            this.setState({activeTab: tab})
    };

    // set of functions used to add, get and reset the uploaded files paths
    getPaths   = () => {return this.state.paths};
    resetPaths = () => {this.setState({paths: []})};
    addPath    = (path) => {
        this.setState(prevState => ({
                paths: [...prevState.paths, path]
            })
    )};

    close_button = () =>{
        if(this.state.activeTab === '3') {
            this.resetPaths();
            // add delete files operation
            console.log(this.state.activeTab);
            this.toggle('2');
        }
        this.props.closePop()
    };

    render() {
        return(
            <div>
                <button type="button" className="close" aria-label="Close" onClick={this.close_button}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })}>
                           Login
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })}>
                           Files Upload
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })}>
                            Import
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <br/>
                                <Login onbutton="auth_btn" successAuth={this.setToken} changeTab={this.toggle}/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <div>
                                    <br/>
                                    <Uploader token={this.state.api_token} addPaths={this.addPath} changeTab={this.toggle}/>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col sm="12">
                                <div>
                                    <br/>
                                    <ImportDB token={this.state.api_token} paths={this.getPaths}/>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}
