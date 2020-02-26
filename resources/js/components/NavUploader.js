import React, {Component} from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Login from "./Authentication";
import Uploader from "./UploaderFile";

export default class NavUploader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            api_token: ''
        };
        this.setToken = this.setToken.bind(this);
        this.toggle   = this.toggle.bind(this)
    }

    // function used to update the api-token and show the uploader csv component
    setToken = (new_token) => {
        this.setState({
            api_token: new_token
        }, function () {
            console.log(this.state.api_token)
        });
    };

    // function used to change the tab
    toggle = tab => {
        if(this.state.activeTab !== tab)
            this.setState({activeTab: tab})
    };

    render() {
        return(
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                        >
                           Login
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                        >
                           Files Upload
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
                                    <Uploader token={this.state.api_token}/>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}
