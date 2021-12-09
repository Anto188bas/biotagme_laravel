import React, {Component} from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Login      from "./Authentication";
import Uploader   from "./UploaderFile";
import ImportDB   from "./ImportTable";

export default class NavUploader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            api_token: '',
            paths: []
        };
        this.nav_opt    = ["Login","Files Upload","Import"];
        this.setToken   = this.setToken.bind(this);
        this.toggle     = this.toggle.bind(this);
        this.addPath    = this.addPath.bind(this);
        this.getPaths   = this.getPaths.bind(this);
        this.resetPaths = this.resetPaths.bind(this);
        this.create_nav_components = this.create_nav_components.bind(this);
    }

    // function used to update the api-token and show the uploader csv component
    setToken = (new_token) => {this.setState({api_token: new_token})};

    // function used to change the tab
    toggle = tab => {
        if(this.state.activeTab !== tab)
           this.setState({activeTab: tab})
    };

    // set of functions used to add, get and reset the uploaded files paths
    getPaths   = ()     => {return this.state.paths};
    resetPaths = ()     => {this.setState({paths: []})};
    addPath    = (path) => {this.setState(prevState => ({paths: [...prevState.paths, path]}))};

    // function used to close the uploader nav window
    close_button = () => {
        if(this.state.activeTab === '3')
            window.location.reload();

        this.props.closePop();
    };

    create_nav_components = (opt) => {
       switch (opt) {
           case 0: return <Login onbutton="auth_btn" successAuth={this.setToken} changeTab={this.toggle}/>;
           case 1: return <Uploader token={this.state.api_token} addPaths={this.addPath} changeTab={this.toggle}/>;
           case 2: return <ImportDB token={this.state.api_token} paths={this.getPaths}/>
       }
    };


    render() {
        return(
            <div>
                <button type="button" className="close" aria-label="Close" onClick={this.close_button}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Nav tabs>
                    {
                        Array.from(this.nav_opt).map((opt,idx) =>
                            <NavItem key={opt}>
                               <NavLink className={classnames({active: this.state.activeTab === (idx + 1).toString()})}>
                                    {opt}
                               </NavLink>
                            </NavItem>
                        )
                    }
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        Array.from(Array(this.nav_opt.length).keys()).map((val) =>
                            <TabPane key={val} tabId={(val+1).toString()}>
                                <Row>
                                    <Col sm="12">
                                        <div>
                                            <br/>
                                            {this.create_nav_components(val)}
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        )
                    }
                </TabContent>
            </div>
        )
    }

}
