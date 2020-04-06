import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

export class CytoNet extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const col_graph = document.getElementById('test');
        if(col_graph != null) {
            this.setState({weight_cl: col_graph.clientWidth});
            this.setState({height_cl: col_graph.clientHeight});
        }
    }

    getRndInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    render(){
        const nodes  = this.props.nodes;
        let networks = [];
        let elements = [];

        console.log(nodes);
        for(const k in nodes) {
            if(nodes.hasOwnProperty(k)) {
                const node = nodes[k];
                elements.push({
                    data: {id: node['idx'], label: node['name'], type:node['type'].toLowerCase()},
                    position:{
                        x: this.getRndInteger(20, this.state.weight_cl - 20),
                        y: this.getRndInteger(20, this.state.height_cl - 20)
                    }
                });

                let nodes_mp = [];
                const linked_components = node['linkedComps'];
                for (const k1 in linked_components) {
                    if (linked_components.hasOwnProperty(k1) && !nodes_mp.includes(k1)) {
                        const linked_component = linked_components[k1];
                        nodes_mp.push(k1);
                        elements.push({
                            data: {id: k1, label: linked_component['name']},
                            position:{
                                x: this.getRndInteger(20, this.state.weight_cl - 20),
                                y: this.getRndInteger(20, this.state.height_cl - 20)
                            }
                        })
                    }
                }

                //nodes_mp = [];
                //const wpages = node['wikipage'];
                //let i = 0, j = 0;
                //for(const k2 in wpages){
                //    if(wpages.hasOwnProperty(k2) && !nodes_mp.includes(k2)){
                //        const wpage = wpages[k2];
                //        nodes_mp.push(k2);
                //        elements.push({data: {id:k2, label:k2}})
                //    }
                //}

                networks = node['subnetwork'];
                let idx1s = new Set(), idx2s = new Set();
                for (const k3 in networks) {
                    if (networks.hasOwnProperty(k3)) {
                        const row = networks[k3];
                        if (!idx2s.has(row['idx2']) || !idx1s.has(row['idx1'])) {
                            idx1s.add(row['idx1']);
                            idx2s.add(row['idx2']);
                            elements.push({data: {source: row['idx1'], target: row['idx2']}})
                        }
                    }
                }
            }
            console.log(this.state.weight_cl);
            console.log(this.state.height_cl);
        }

        return(
           <CytoscapeComponent
               elements={elements}
               className='card'
               style={{ width: '100%', height: '100%'}}
           />
        );
    }
}
