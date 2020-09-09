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
        this.edgesView  = React.createRef();
        this.elements   = [];
        this.total_net  = [];
        this.count_node =  0;
        this.total_node =  0;
        this.getNetworkFromDB = this.getNetworkFromDB.bind(this)
    }

    componentDidMount() {this.setUpListeners();}

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
                    str_score   :  row['str_score']
                });
            }
        });
        return info_edge
    };


    build_edge = (type, edge) => {
        return {
            data: {
                source            :   edge['idx1'],
                target            :   edge['idx2'],
                color             :   type === 0 ? 'red':'green',
                'outside-to-node' :   true
            }
        };
    };

    getNetworkFromDB    = () => {
        this.count_node = 0;
        this.total_node = 0;
        this.total_net  = this.props.edges;
        this.elements   = [];

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
                }
            const all_edges = this.total_net['edges'];
            all_edges.forEach(edge => {
                if(edge['btg_score'] !== 0)
                    this.elements.push(this.build_edge(0,edge));
                if(edge['str_score'] !== 0)
                    this.elements.push(this.build_edge(1,edge));
            })
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
                           'border-width'       :  2,
                           'background-opacity' :  0.5,
                           width                :  75,
                           height               :  75,
                           label                : 'data(label)',
                       }
                   },
                   {
                       selector: 'edge',
                       style: {
                           'line-color': 'data(color)',
                           width       : 1.5
                       }
                   }
               ]}
               style = {{width: '100%', height: '100%'}}
               cy    = {
                   (cy) => {
                        this.cy = cy;
                        cy.on('add', 'node', _evt => {
                           this.count_node++;
                           if(this.count_node === this.total_node) {
                              cy.layout(layout).run();
                              cy.fit();
                           }
                        })
               }}
           />
        )
    }
}
