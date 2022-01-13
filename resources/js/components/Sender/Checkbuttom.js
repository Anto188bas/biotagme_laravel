import React          from "react";
import {Button, Col, Container, Row} from "reactstrap";


export default class Checkbuttoms extends React.Component {
    constructor(props) {
        super(props);
        this.bio_categories_nodes = {
            "GENE"  : "1", "PROTEIN": "1", "DISEASE": "1",
            "miRNA" : "1", "LNC"    : "1", "mRNA"   : "1",
            "DRUG"  : "1", "PATHWAY": "1", "ENZYME" : "1",
        };
        this.bio_categories_edges = {
            "BioTG" : "1", "STRING" : "1", "LITERATURE": "1"
        }
        this.state = {
            buttons: this.create_button_state()
        }
    };

    range(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i)
    }

    create_button_state() {
        // EDGE LABELS
        if (this.props.edge_colors)
           return Object.keys(this.bio_categories_edges).map(_ => true)
        // NODE LABELS
        return Object.keys(this.bio_categories_nodes).map(key => {
            if(this.props.opt !== "1") return true
            if (this.props.categories)
                return this.props.categories.components.indexOf(key) !== -1
            return true
        })
    }

    button_style(position, selected_color) {
        if(this.state.buttons[position])
           return {background: selected_color, borderColor: selected_color}
        return    {background: "#fff",         borderColor: selected_color, color: selected_color}
    }

    // ONLY FOT OPTION 1
    change_button_state(index) {
        const selected_element = Object.keys(this.bio_categories_nodes)[index]
        if (this.state.buttons[index]) {
            const elements = this.props.categories.components
            this.props.categories.components = elements.filter(element => element !== selected_element)
        }
        else
            this.props.categories.components.push(selected_element)
        this.state.buttons[index] = !this.state.buttons[index];
        this.setState({buttons: this.state.buttons})
    }

    array_button_creation(){
        const keys      = Object.keys(this.props.node_colors ? this.bio_categories_nodes : this.bio_categories_edges);
        const colors    = this.props.node_colors ? this.props.node_colors : this.props.edge_colors
        const n_rows    = Math.ceil(keys.length / 3);
        return this.range(0, n_rows - 1).map(row_id  =>
            <Row key={row_id}>
                {
                    this.range(1, 3).map(col_id => {
                        const index          = row_id * 3 + col_id
                        const element_name   = keys[index]
                        const selected_color = colors[element_name]
                        const style          = this.button_style(index, selected_color)
                        return <Col key={col_id} className="m-1">
                            {
                                this.props.opt === "1" ?
                                <Button
                                    className = "checkout-button"
                                    style     = {style}
                                    onClick   = {_ => this.change_button_state(index)}
                                >
                                    {element_name}
                                </Button> :
                                <Button
                                    className = "checkout-button"
                                    style     = {style}
                                    disabled
                                >
                                    {element_name}
                                </Button>
                            }
                        </Col>
                    })
                }
            </Row>
        )
    }

    render() {
        return(
            <Container className="pl-0">
                {
                    this.array_button_creation()
                }
            </Container>
        )
    }
}
