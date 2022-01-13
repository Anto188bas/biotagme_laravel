import {Card, CardBody, Collapse, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import React                  from 'react';
import * as classnames        from "classnames";
import NavUploader            from "../Uploader/NavUploader";
import {Echo_or_Shortest}     from "./EchoNet_or_shortestPth";
import {ResultsManager}       from "./ResultsManager";


export default class BioElemSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen      : false,
            navUploaderOpen  : false,
            activeTab        : "1",
        };
        this.manager_ref = React.createRef();
        this.toggle      = this.toggle.bind(this);
        this.newNavState = this.newNavState.bind(this);
    }


    // function used to open or close the popup containing information about the name of the biology element.
    toggle            = ()      => {this.setState({popoverOpen: !this.state.popoverOpen,})};
    newNavState       = ()      => {this.setState({navUploaderOpen: !this.state.navUploaderOpen,})};
    set_manager_nodes = (nodes) => {this.manager_ref.current.set_node(nodes)};

    toggle_nav  = (tab) => {
        if(this.state.activeTab !== tab)
           this.setState({activeTab: tab})
    };

    componentDidMount = () => {
        Echo.channel('import')
            .listen('.CSVimportEvent', ev => console.log(ev));
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.nav_pos !== this.state.activeTab) {
            this.setState({activeTab: nextProps.nav_pos})
        }
    };

   render() {
        return (
            <Card className="card">
                <CardBody className="card-body">
                    <Nav tabs>
                        {
                            Array("Echo network", "Shortest path", "Result Manager").map((elem, idx) =>
                                <NavItem key={idx}>
                                    <NavLink
                                        className = {classnames({active: this.state.activeTab === (idx + 1).toString()})}
                                        onClick   = {() => {this.toggle_nav((idx + 1).toString())}}
                                    >{elem}
                                    </NavLink>
                                </NavItem>
                            )}
                    </Nav>
                    <br/>
                    <TabContent activeTab={this.state.activeTab}>
                        {
                            Array("1", "2").map(opt_i =>
                                <TabPane tabId={opt_i} key={opt_i}>
                                    <Echo_or_Shortest
                                        opt_sel      = {opt_i}
                                        edges        = {this.props.edges}
                                        nodes_colors = {this.props.colors}
                                        colors_edges = {this.props.colors_edges}
                                    />
                                </TabPane>
                            )
                        }
                                <TabPane tabId={"3"}>
                                     <ResultsManager
                                         values       = {"3"}
                                         colors       = {this.props.colors}
                                         colors_edges = {this.props.colors_edges}
                                         state_node   = {this.props.state_node}
                                         ref          = {this.manager_ref}
                                     />
                                </TabPane>
                    </TabContent>
                    {this.state.activeTab !== '3' ?
                        <React.Fragment>
                            <button type="button" className="btn btn-link" onClick={this.newNavState}>Network Upload</button>
                            <Collapse isOpen={this.state.navUploaderOpen}>
                               <Card className="mt-4">
                                  <CardBody>
                                     <NavUploader closePop={this.newNavState}/>
                                  </CardBody>
                                </Card>
                            </Collapse>
                            </React.Fragment>: null
                    }
                </CardBody>
            </Card>
        );
    }
}
