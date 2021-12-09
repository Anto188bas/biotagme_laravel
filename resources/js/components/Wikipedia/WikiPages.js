import React, {Component} from "react";
import classnames         from "classnames";
import {PagesNavigator}   from "./PagesNavigator";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";

export class WikiPages extends Component {
    constructor(props) {
        super(props);
        this.state  = {activeTab: '1'};
        this.panels = Array('Element 1 Wikipedia Pages', "Element 2 Wikipedia Pages", "PubMed articles")
    }

    toggle = tab => {
        if(this.state.activeTab !== tab)
            this.setState({activeTab: tab})
    };


    pages_selector = (opt) => {
        if(opt !== 2)
           return this.props.info_edge['node'.concat((opt+1).toString())]['wiki_pages'];
        return this.props.info_edge["pmids"]
    };

    render(){
        return(
            <React.Fragment>
                <Nav tabs>
                    {
                        this.panels.map((page,idx) =>
                            <NavItem key={page}>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === (idx + 1).toString()})}
                                    onClick={() => {this.toggle((idx + 1).toString())}}
                                >
                                    {page}
                                </NavLink>
                            </NavItem>
                        )
                    }
                </Nav>
                <br/>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        (this.props.info_edge !== undefined && this.props.info_edge !== null) ?
                            this.panels.map((val, idx) =>
                            <TabPane key={idx} tabId={(idx+1).toString()}>
                                <PagesNavigator
                                    opt       = {idx}
                                    pages     = {this.pages_selector(idx)}
                                    page4view = {3}
                                />
                            </TabPane>) : null
                    }
                </TabContent>
            </React.Fragment>
        )
    }
}
