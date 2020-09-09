import {Card, CardBody, FormGroup, Collapse, Spinner, Nav, NavItem, NavLink, TabContent, TabPane}from 'reactstrap';
import React                  from 'react';
import {Formik, Form, Field}  from "formik";
import axios                  from "axios";
import * as Yup               from 'yup';
import * as classnames        from "classnames";

import NavUploader            from "../NavUploader";
import {SenderInput}          from "./SenderInput";
import {SelTypesORLegend}     from "./SelTypesORLegend";
import {Error}                from "../Error/Error";
import {TopN}                 from "./TopN";

Echo.channel('import')
    .listen('.CSVimportEvent', ev => console.log(ev));


export default class BioElemSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen      : false,
            navUploaderOpen  : false,
            spinnerRun       : false,
            error_post       : false,
            activeTab        :    '1'
        };
        this.toggle      = this.toggle.bind(this);
        this.newNavState = this.newNavState.bind(this);
        this.newSpinSt   = this.newSpinSt.bind(this);
    }

    

    // function used to open or close the popup containing information about the name of the biology element.
    toggle      = ()  => {this.setState({popoverOpen: !this.state.popoverOpen,})};
    newNavState = ()  => {this.setState({navUploaderOpen: !this.state.navUploaderOpen,})};
    newSpinSt   = ()  => {this.setState({spinnerRun: !this.state.spinnerRun})};
    toggle_nav  = (tab, values) => {
        if(this.state.activeTab !== tab)
           this.setState({activeTab: tab})
    };


    schema_validation = Yup.object().shape({
        bioElem1 : Yup.string().when('nav_tab', {
            is   : (nav_tab) => nav_tab !== '3',
            then : Yup.string().required('Required')
        }),
        bioElem2 : Yup.string().when('nav_tab', {
            is   : (nav_tab) => nav_tab === '2',
            then : Yup.string().required('Required')
        }),
        query    : Yup.string().when('nav_tab', {
            is   : (nav_tab) => nav_tab === '3',
            then : Yup.string().required('Required')
        }),
        components : Yup.array().min(1)
    });


   render() {
        return (
            <Card className="card">
                <CardBody className="card-body">
                    <Formik
                        enableReinitialize={true}
                        initialValues={
                            {
                                bioElem1    : '',
                                select1     : 'GENE',
                                bioElem2    : '',
                                select2     : 'GENE',
                                query       : '',
                                components  : ['GENE','PROTEIN','DISEASE','miRNA','LNC','mRNA','DRUG', 'PATHWAY'],
                                top_n       : '10',
                                nav_tab     : this.state.activeTab
                            }
                        }
                        validationSchema={this.schema_validation}
                        onSubmit={values => {
                            const this_cl = this;
                            this_cl.newSpinSt();
                            axios.post('/searchElements', {
                                names    : values.nav_tab !== '3' ? (values.bioElem1.toString() + (values.nav_tab === '2' ? "\t" + values.bioElem2 : "")) : values.query,
                                top_n    : values.top_n,
                                elements : values.components,
                                types    : values.nav_tab !== '3' ? (values.select1.toString()  + (values.nav_tab === '2' ? "\t" + values.select2  : "")) : '',
                                opt      : values.nav_tab
                            }).then(function (response){
                                this_cl.props.edges(response.data.response);
                                this_cl.newSpinSt()
                            }).catch(function (error) {
                               console.log(error);
                               this_cl.setState({error_post:true});
                               this_cl.newSpinSt();
                            })
                        }}
                    >
                        {({values, handleChange, errors}) => (
                            <Form>
                                <Nav tabs>
                                    {Array("Single search", "Shortest path").map((elem, idx) =>
                                        <NavItem key={idx}>
                                            <NavLink
                                                className = {classnames({ active: this.state.activeTab === (idx + 1).toString()})}
                                                onClick   = {() => {
                                                    values.nav_tab = (idx + 1).toString();
                                                    this.toggle_nav((idx + 1).toString())}
                                                }
                                            >{elem}
                                            </NavLink>
                                        </NavItem>
                                    )}
                                </Nav>
                                <br/>
                                <FormGroup>
                                    <TabContent activeTab={this.state.activeTab}>
                                        {Array("1", "2", "3").map(opt_i =>
                                            <TabPane tabId={opt_i} key={opt_i}>
                                                <SenderInput
                                                    opt     = {opt_i}
                                                    values  = {values}
                                                    errors  = {errors}
                                                    handler = {handleChange}
                                                />
                                            </TabPane>
                                        )}
                                    </TabContent>
                                </FormGroup>
                                <FormGroup>
                                    <SelTypesORLegend num_col={3} values={values} colors={this.props.colors}/>
                                    {errors.components ?
                                        <Error message={"you have to select one element at least"}/> : null
                                    }
                                    {this.state.activeTab !== '2' ?
                                        <TopN values={values} handler={handleChange} max_opt={5}/>  : null
                                    }
                                </FormGroup>
                                {
                                    this.state.spinnerRun ?
                                        <Spinner color='primary' style={{float:'right'}}/> :
                                        <button  type      = "submit"
                                                 className = "btn btn-primary"
                                                 style     = {{float:'right'}}
                                        >Submit</button>
                                }
                            </Form>
                        )}
                    </Formik>
                    {this.state.error_post ?
                        <div><p className="text-danger">Internal Error</p></div> : null
                    }
                    <button type="button" className="btn btn-link" onClick={this.newNavState}>Network Upload</button>
                    <Collapse isOpen={this.state.navUploaderOpen}>
                       <Card className="mt-4">
                          <CardBody>
                             <NavUploader closePop={this.newNavState}/>
                          </CardBody>
                        </Card>
                    </Collapse>
                </CardBody>
            </Card>
        );
    }
}
