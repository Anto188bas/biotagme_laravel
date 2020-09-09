import React from "react";

export class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <p className="text-danger">
                    {this.props.message}
                </p>
            </div>
        );
    }
}
