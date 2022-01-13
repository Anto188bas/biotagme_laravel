import React                          from "react";
import ReactDOM                       from "react-dom";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {LoadingComponent}             from "../components/CommonComponent";
import Homepage                       from "./Homepage";


const Searching  = React.lazy(() => import("./App"));

const waitingComponent = Component => {
    return props => (
        <React.Suspense
            fallback={<div className="container"><LoadingComponent className="my-4" message="Please wait..."/></div>}>
            <Component {...props} />
        </React.Suspense>
    );
};


export class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path = "/"         component={Homepage}/>
                    <Route       path ="/searching" component={waitingComponent(Searching)}/>
                </Switch>
            </BrowserRouter>
        )
    };
}

if(document.getElementById('app_div')){
    ReactDOM.render(<MainPage/>, document.getElementById('app_div'));
}
