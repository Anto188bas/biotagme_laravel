import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import ReactDOM from "react-dom";
import {Edgeview} from "./Edgeview";


cytoscape.use( popper );

export class CytoNet extends Component {
    constructor(props) {
        super(props);
        this.edgesView = React.createRef();
        this.elements  = [];
        this.total_net = [];
    }

    componentDidMount() {
        const col_graph = document.getElementById('cypher_box');
        if(col_graph != null) {
            this.setState({weight_cl: col_graph.clientWidth});
            this.setState({height_cl: col_graph.clientHeight});
        }
        this.setUpListeners();
    }

    getRndInteger = (min, max) => {return Math.floor(Math.random() * (max - min)) + min};

    getNodeInfoLikeJson = (node, id) => {
        return {
            data: {id: id, label: node['name'], type:node['type'].toLowerCase()},
            position:{
                x: this.getRndInteger(20, this.state.weight_cl - 20),
                y: this.getRndInteger(20, this.state.height_cl - 20)
            }
        }
    };

    getScores_wikiInfo2SEdge = (edge) => {
        let info_edge = [];
        let name1="", name2="";
        this.total_net.forEach(row => {
            if(row['idx1'].toString() === edge.source && row['idx2'].toString() === edge.target){
                name1 = this.cy.nodes("[id = '"+ row['idx1'] +"']")[0]._private.data.label;
                name2 = this.cy.nodes("[id = '"+ row['idx2'] +"']")[0]._private.data.label;
                info_edge.push({
                    wid1:row['wid1'], wid2:row['wid2'], btg_score:row['btg_score'], str_score:row['str_score']
                });
            }
        });
        return [name1, name2, info_edge]
    };

    getNetworkFromDB = () => {
        const nodes  = this.props.nodes;
        let networks   = [];
        this.total_net = [];
        this.elements  = [];

        for(const k in nodes) {
            if(nodes.hasOwnProperty(k)) {
                const node = nodes[k];
                this.elements.push(this.getNodeInfoLikeJson(node, node['idx']));

                let nodes_mp = [];
                const linked_components = node['linkedComps'];
                for (const k1 in linked_components) {
                    if (linked_components.hasOwnProperty(k1) && !nodes_mp.includes(k1)) {
                        const linked_component = linked_components[k1];
                        nodes_mp.push(k1);
                        this.elements.push(this.getNodeInfoLikeJson(linked_component, k1));
                    }
                }

                networks = node['subnetwork'];
                let idx1s = new Set(), idx2s = new Set();
                for (const k3 in networks) {
                    if (networks.hasOwnProperty(k3)) {
                        const row = networks[k3];
                        this.total_net.push(row);
                        if (!idx2s.has(row['idx2']) || !idx1s.has(row['idx1'])) {
                            idx1s.add(row['idx1']);
                            idx2s.add(row['idx2']);
                            this.elements.push({data: {source: row['idx1'], target: row['idx2']}})
                        }
                    }
                }
            }
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
                let popper_cy = this.cy.edges("[id = '"+ data_edge.id +"']").popper({
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
        //console.log(this.elements);
        return(
           <CytoscapeComponent
               elements={this.elements}
               className='card'
               stylesheet={[
                   {
                       selector: 'node[type="protein"]',
                       style: {
                           'background-color': 'red',
                           label: 'data(label)'
                       }
                   },
                   {
                       selector: 'node[type="gene"]',
                       style: {
                           'background-color': 'blue',
                           label: 'data(label)'
                       }
                   }
               ]}
               style={{ width: '100%', height: '100%'}}
               cy={(cy) => {this.cy = cy}}
           />
        );
    }
}
