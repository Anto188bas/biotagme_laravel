import React from "react";
import {Button} from "reactstrap";

export class Active_Node extends React.Component{
    constructor(props) {
        super(props);
        this.state = {active:true}
    }

    change_state = () => {
        this.props.state_mode(this.props.id_node, this.state.active);
        this.setState({active:!this.state.active})
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.id_node !== this.props.id_node)
            this.setState({active:true})
    };

    render() {
        return (
            this.state.active ?
                <Button onClick={() => this.change_state()} color="primary">ON </Button>:
                <Button onClick={() => this.change_state()} color="danger" >OFF</Button>
        );
    }
}
