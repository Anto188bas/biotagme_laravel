import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "../../../public/css/siderbar.css";

export default class Sidebar extends Component{
    render() {
        return <div className="sidebar-container">
                    <div className="sidebar">
                        <div className="sidebar-link">Home</div>
                        <div className="sidebar-link">About</div>
                        <div className="sidebar-link">Contact</div>
                    </div>
               </div>
    }
}

if(document.getElementById('sidebar')){
    ReactDOM.render(<Sidebar />, document.getElementById('sidebar'));
}
