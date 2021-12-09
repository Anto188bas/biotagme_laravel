import React from "react";
import {Card, CardText, CardTitle, Progress} from "reactstrap";

export class FileLoaderState  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file_loader_state: 0}
    }

    getSize = (file) => {
        const file_size = file.size;
        if(file_size === 0) return '0 Bytes';
        const k = 1024,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(file_size) / Math.log(k));
        return parseFloat((file_size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    change_file_state = (new_state) => {this.setState({file_loader_state : new_state})}

    render(){
        return (
            <Card body>
                <CardTitle>{this.props.file.name}</CardTitle>
                <CardText>{this.getSize(this.props.file)}</CardText>
                <Progress bar value={this.state.file_loader_state} max={100}>{this.state.file_loader_state}</Progress>
            </Card>
        );
    }
}
