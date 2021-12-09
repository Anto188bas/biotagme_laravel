import  React                from 'react';
import {Form, Formik}        from "formik";
import * as Yup              from "yup";
import axios                 from "axios";
import {FormGroup, Spinner}  from "reactstrap";
import {SenderInput}         from "./SenderInput";
import {SelTypesORLegend}    from "./SelTypesORLegend";
import {Error}               from "../Error/Error";
import {TopN}                from "./TopN";

export class Echo_or_Shortest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerRun: false,
            error_post: false
        }
    }

    newSpinSt = () => {this.setState({spinnerRun: !this.state.spinnerRun})};

    // Schema definition
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
        const nodes_colors_associations = Array.from(Object.keys(this.props.nodes_colors));
        const opt = this.props.opt_sel;

        return (
            <React.Fragment>
            <Formik
                enableReinitialize={true}
                initialValues={
                    {
                        bioElem1    : '',
                        select1     : 'GENE',
                        bioElem2    : '',
                        select2     : 'GENE',
                        query       : '',
                        components  : nodes_colors_associations,
                        top_n       : '10',
                        nav_tab     : opt
                    }
                }
                validationSchema={this.schema_validation}
                onSubmit={ values => {
                    const this_cl = this;
                    this_cl.newSpinSt();
                    axios.post('/searchElements', {
                        names    : values.bioElem1.toString() + (values.nav_tab === '2' ? "\t" + values.bioElem2 : ""),
                        top_n    : values.top_n,
                        elements : values.components,
                        types    : values.select1.toString()  + (values.nav_tab === '2' ? "\t" + values.select2  : ""),
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
                        <FormGroup>
                            <SenderInput
                                opt     = {opt}
                                values  = {values}
                                errors  = {errors}
                                handler = {handleChange}
                            />
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <SelTypesORLegend
                                num_col     = {3}
                                values      = {opt}
                                colors      = {this.props.nodes_colors}
                                colors_edge = {this.props.colors_edges}
                            />
                            {errors.components ?
                                <Error message={"you have to select one element at least"}/> : null
                            }
                            {opt === '1' ?
                                <TopN values={values} handler={handleChange} max_opt={20}/>  : null
                            }
                        </FormGroup>
                        {
                           this.state.spinnerRun ?
                              <Spinner color='primary' style={{float:'right'}}/> :
                              <button  type ='submit'  className='btn btn-primary' style= {{float:'right'}}>Submit</button>
                        }
                    </Form>
                )}
            </Formik>
            {this.state.error_post ?
                <div><p className="text-danger">Internal Error</p></div> : null
            }
            </React.Fragment>
        );
    }
}
