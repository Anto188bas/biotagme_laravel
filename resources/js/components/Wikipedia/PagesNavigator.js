import React from 'react';
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";

export class PagesNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state       = {page:0};
        this.pages4view  = props.page4view;
        this.uri         = this.props.opt !== 2 ? 'http://en.wikipedia.org/?curid=' : "https://pubmed.ncbi.nlm.nih.gov/";
        this.view_number = 0;
    }

    href_creation = (id) => {
        if(this.props.opt !== 2)
            return this.uri + id;
        return this.uri + this.props.pages[id] + "/"
    };

    render_pages = (pages_ids) => {
        const start  =  this.pages4view *  this.state.page;
        const tmp    =  this.pages4view * (this.state.page + 1);
        const stop   =  Math.min(pages_ids.length, tmp);

        return(
            <ul>
                {
                    pages_ids.slice(start,stop).map((id, idx) =>
                        <li key={idx}>
                           <a href = {this.href_creation(id)} target="_blank">{this.props.pages[id]}</a>
                        </li>
                    )
                }
            </ul>
        )
    };

    on_click = (key) => {
        switch (key.toString()) {
            case "Back":
                if(this.state.page > 0)
                   this.setState(prev => ({page: prev.page - 1}));
                break;
            case "Next":
                if(this.state.page < this.view_number - 1)
                   this.setState(prev => ({page: prev.page + 1}));
                break;
            default:
                this.setState({page: key})

        }
    };

    pagination_item = (key, idx) => {
        return (
            idx !== -1 ?
                <PaginationItem key={idx}>
                    <PaginationLink >{
                        "Page " + this.state.page.toString() +
                        " of "  + (this.view_number !==0 ? this.view_number -1 : 0).toString()
                    }</PaginationLink>
                </PaginationItem> :
                <PaginationItem onClick = {() => {this.on_click(key)}}>
                    <PaginationLink tag ="button">{key}</PaginationLink>
                </PaginationItem>
        );
    };

    pagination_item_comstruction = (pages) => {
         this.view_number = Math.ceil(pages.length / this.pages4view);
         return(
             <React.Fragment>
                 {this.render_pages(pages)}
                 <br/>
                 <nav>
                     <Pagination>
                         {this.pagination_item("Back", -1)}
                         {this.pagination_item(0, 0)}
                         {this.pagination_item("Next", -1)}
                     </Pagination>
                 </nav>
             </React.Fragment>
         );
    };


    componentWillUpdate = (nextProps, nextState, nextContext) => {
        if(nextProps.pages !== this.props.pages){
            this.setState({page:0})
        }
    };

    render() {
        return (
            this.props.pages !== undefined && this.props.pages !== null ?
                this.pagination_item_comstruction(Object.keys(this.props.pages)) : null
        );
    }

}
