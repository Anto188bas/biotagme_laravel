import React, {Component} from "react";
import {
    Col,
    Nav,
    NavItem,
    NavLink,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    TabContent,
    TabPane
} from "reactstrap";
import classnames from "classnames";

export class PageNavigator extends  Component {
    constructor(props) {
        super(props);
        this.state = {page:0};
        this.pages4view = props.page4view;
        this.uri        = 'http://en.wikipedia.org/?curid=';
    }

    render_wiki_page = (wiki_pages_ids) => {
        const start =  this.pages4view * this.state.page;
        const tmp   =  this.pages4view * (this.state.page + 1);
        const stop  =  Math.min(wiki_pages_ids.length, tmp);

        return(
            <React.Fragment>
                <ul>
                {
                    wiki_pages_ids.slice(start,stop).map((wiki_id, id) =>
                        <li key={id}>
                            <a href = {this.uri + wiki_id} target="_blank">{this.props.tot_pages[wiki_id]}</a>
                        </li>
                    )
                }
                </ul>
            </React.Fragment>
        )
    };

   render(){
       const wiki_pages_ids  = Object.keys(this.props.tot_pages);
       this.view_number      = Math.ceil(wiki_pages_ids.length / this.pages4view);
       const paginationItems = Array(this.view_number).fill('').map((i, index) =>(
           <PaginationItem key={index} active={this.state.page === index}>
               <PaginationLink tag="button" onClick={() => this.setState({page: index })}>{index + 1}</PaginationLink>
           </PaginationItem>
       ));
       return(
           <React.Fragment>
               {this.render_wiki_page(wiki_pages_ids)}
               <nav>
                   <br/>
                   <Pagination>
                       <PaginationItem onClick={() => {
                           if(this.state.page < this.view_number - 1)
                               this.setState(prev => ({page: prev.page + 1}))}
                       }>
                           <PaginationLink next tag="button">Next</PaginationLink>
                       </PaginationItem>
                       {paginationItems}
                       <PaginationItem onClick={() => {
                           if(this.state.page > 0)
                               this.setState(prev => ({page: prev.page -1}))}
                       }>
                           <PaginationLink>Back</PaginationLink>
                       </PaginationItem>
                   </Pagination>
               </nav>
           </React.Fragment>
       );
    }
}



export class WikiPages extends Component {
    constructor(props) {
        super(props);
        this.state  = {activeTab: '1'};
        this.panels = Array('Element 1 Wikipedia Pages', "Element 2 Wikipedia Pages")
    }

    toggle = tab => {
        if(this.state.activeTab !== tab)
            this.setState({activeTab: tab})
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
                        this.props.info_edge != null ? this.panels.map((val,idx) =>
                            <TabPane key={idx} tabId={(idx+1).toString()}>
                                <PageNavigator
                                    tot_pages = {this.props.info_edge['node'.concat((idx+1).toString())]['wiki_pages']}
                                    page4view = {3}
                                />
                            </TabPane>
                        ) : null
                    }
                </TabContent>
            </React.Fragment>
        )
    }
}
