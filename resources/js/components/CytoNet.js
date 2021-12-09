import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import popper     from 'cytoscape-popper';
import ReactDOM   from "react-dom";
import {Edgeview} from "./Edgeview";

let Cytoscape = require('cytoscape');
    Cytoscape.use( popper );


export class CytoNet extends Component {
    constructor(props) {
        super(props);
        this.edgesView    = React.createRef();
        this.elements     = [];
        this.total_net    = [];
        this.count_node   =  0;
        this.total_node   =  0;
        this.hidden_nodes = new Map();
        this.nodes4_tab   = [];
        this.getNetworkFromDB = this.getNetworkFromDB.bind(this)
    }

    componentDidMount  = () => {this.setUpListeners()};
    componentDidUpdate = (prevProps, prevState, snapshot) => {this.props.set_nodes(this.nodes4_tab)};

    remove_node = (id_node) => {
        const nodes   = this.cy.nodes("[id = '"+ id_node +"']");
        const this_cl = this;
        nodes.forEach(function(ele){
            this_cl.hidden_nodes.set(id_node, this_cl.cy.remove(ele));
        });
    };
    add_node = (id_node) => {
        this.cy.add(this.hidden_nodes.get(id_node));
        this.hidden_nodes.delete(id_node)
    };
    manage_node    = (id_node, flag) => {flag ? this.remove_node(id_node): this.add_node(id_node)};
    add_all_nodes  = () => {Array.from(this.hidden_nodes.keys()).map(v => this.add_node(v))};


    getScores_wikiInfo2SEdge = (edge) => {
        let info_edge = [];
        let name1="", name2="";
        this.total_net['edges'].forEach(row => {
             if(row['idx1'].toString() === edge.source && row['idx2'].toString() === edge.target){
                name1 = this.cy.nodes("[id = '"+ row['idx1'] +"']")[0]._private.data.label;
                name2 = this.cy.nodes("[id = '"+ row['idx2'] +"']")[0]._private.data.label;
                info_edge.push({
                    node1       :  this.total_net['nodes'][row['idx1']],
                    node2       :  this.total_net['nodes'][row['idx2']],
                    btg_score   :  row['btg_score'],
                    str_score   :  row['str_score'],
                    liter_evid  :  row['liter_evid'],
                    pmids       :  row['pmids']
                });
            }
        });
        return info_edge
    };

    build_edge = (type, edge) => {
        let color = "";
        switch(type) {
            case 0:
                color = "red";
                break;
            case 1:
                color = "green";
                break;
            default:
                color = "yellow";
        }
        return {
            data: {
                source            :   edge['idx1'],
                target            :   edge['idx2'],
                color             :   color,
                'outside-to-node' :   true
            }
        };
    };

    getNetworkFromDB    = () => {
        if(this.cy !== undefined)
           this.add_all_nodes();

        this.count_node   = 0;
        this.total_node   = 0;
        this.total_net    = this.props.edges;
        this.elements     = [];
        this.nodes4_tab   = [];
        this.hidden_nodes = new Map();

        if(this.total_net !== undefined && this.total_net.length !== 0){
            const nodes = this.total_net['nodes'];
            for(const key in nodes)
                if(nodes.hasOwnProperty(key)){
                    this.total_node++;
                    this.elements.push({
                        data: {
                            id     : key,
                            label  : nodes[key]['name'],
                            type   : nodes[key]['type'],
                            color  : this.props.colors[nodes[key]['type']],
                        }
                    });
                    this.nodes4_tab.push({id: key, label:nodes[key]['name'], type:nodes[key]['type']})
                }
            const all_edges = this.total_net['edges'];
            all_edges.forEach(edge => {
                if(edge['btg_score'] !== 0)
                    this.elements.push(this.build_edge(0,edge));
                if(edge['str_score'] !== 0)
                    this.elements.push(this.build_edge(1,edge));
                if(edge['liter_evid'] !== 0)
                    this.elements.push(this.build_edge(2,edge));
            });
        }
    };


    setUpListeners = () => {
        let div = document.createElement('div');
        div.setAttribute('id', 'card-edge');
        ReactDOM.render(<Edgeview ref={this.edgesView}/>, div);

        this.cy.on('click', (event) => {
            if(event.target === this.cy)
               div.style.visibility = 'hidden';
            else if(event.target._private.group === 'edges'){
                const data_edge = event.target._private.data;
                let popper_cy   = this.cy.edges("[id = '"+ data_edge.id +"']").popper({
                    content: () => {
                        const edge_elaboration = this.getScores_wikiInfo2SEdge(data_edge);
                        this.edgesView.current.updateNet(edge_elaboration);
                        div.style.visibility = 'visible';
                        document.body.appendChild(div);
                        return div;
                    }
                });
            }
        });
    };


    render(){
        this.getNetworkFromDB();
        const layout = {name:'concentric'};  //spread
        return(
           <CytoscapeComponent
               elements   = {this.elements}
               className  = 'card'
               stylesheet = {[
                   {
                       selector: 'node',
                       style: {
                           'border-color'       : 'data(color)',
                           'background-color'   : 'data(color)',
                           'border-width'       :  0.2,
                           'background-opacity' :  0.5,
                           width                :  15,
                           height               :  15,
                           label                : 'data(label)',
                       }
                   },
                   {
                       selector: 'edge',
                       style: {
                           'line-color': 'data(color)',
                           width       : 0.25
                       }
                   }
               ]}
               style = {{width: '100%', height: '100%'}}
               cy    = {
                   (cy) => {
                        this.cy = cy;
                        cy.add(this.elements);
                        cy.layout(layout).run();
                        cy.fit()
               }}
           />
        )
    }
}
