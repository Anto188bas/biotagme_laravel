import React        from "react";
import Checkbuttoms from "./Checkbuttom";


export class SelTypesORLegend extends React.Component {
    constructor(props) {
        super(props);
    }

    get_legend_value = (opt) => {
        switch (opt) {
            case "1": return "Biological elements type";
            case "2": return "Intermediate node category";
            case "3": return "Node Legend"
        }
    };

    render() {
        const opt        = this.props.values;
        const categories = this.props.tmp;

        return(
            <React.Fragment>
                <React.Fragment>
                    <h5 className="my_label_color"> {this.get_legend_value(opt)}</h5>
                    <Checkbuttoms
                        categories  = {categories}
                        node_colors = {this.props.colors}
                        opt         = {opt}
                    />
                </React.Fragment>
                {
                    opt === '3' ?
                        <React.Fragment>
                            <br/>
                            <h5 className="my_label_color">Edge Legend</h5>
                            <Checkbuttoms
                                categories  = {categories}
                                edge_colors = {this.props.colors_edge}
                                opt         = {opt}
                            />
                        </React.Fragment> : null
                }
            </React.Fragment>
        );
    }
}
