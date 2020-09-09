import React from "react";
import {Formik, Form, Field} from "formik";
import * as Yup from 'yup';
import axios from 'axios';

export default class Login extends React.Component
{
    // class constructor
    constructor(props) {
        super(props);
        this.state  = {
            authentication_error: false,
            error_message: '',
        };

        this.handleForm = this.handleForm.bind(this);
        this.set_error  = this.set_error.bind(this);
    }

    set_error = (message) => {
        this.setState({
            authentication_error: true,
            error_message: message
        });
    };

    // creation of the schema validator
    authSchema = Yup.object().shape({
        email: Yup.string()
            .email()
            .required('You need to specify a name'),
        password: Yup.string()
            .min(6, 'Password too short')
            .required('The password have to be specified')
    });


    // implementation o the handleForm function
    handleForm = (values) => {
        const self = this;
        axios.post('/authentication', {
            email: values.email,
            password: values.password
        }).then(function (response) {
            if(response.data.success) {
                self.props.successAuth(response.data.api_token);
                self.props.changeTab('2')
            }
            else {self.set_error('Unauthorized... check the credentials');}
        }).catch(function (error) {
            self.set_error('Unauthorized... check the credentials');
            console.log(error);
        });
    };


    render() {
        const  formElem = {types:['email', 'password']};
        return(
            <div>
                <Formik
                    initialValues = {{email:'', password:''}}
                    validationSchema = {this.authSchema}
                    onSubmit = {(values) => {this.handleForm(values)}}
                >
                {({errors, touched}) => (
                   <Form>
                      {formElem.types.map((elem,i) => {
                           return(
                              <div key={i} className="form-group">
                                 <h5>{elem.charAt(0).toUpperCase() + elem.slice(1)}</h5>
                                 <Field type      = {elem}
                                        name      = {elem}
                                        className = "form-control"
                                        onClick   = {() => {
                                           if(elem === "password" && this.state.authentication_error)
                                              this.setState({authentication_error:false});
                                        }}
                                 />
                                 {errors[elem] ?
                                     <div>
                                         <p className="text-danger">{errors[elem]}</p>
                                     </div> : null}
                              </div>
                           )}
                      )}
                      {
                          this.state.authentication_error ?
                              <div>
                                  <p className = "text-danger">
                                      {this.state.error_message}
                                  </p>
                              </div>: null
                      }
                   <button type ="submit" className = "btn btn-primary">Login</button>
                   </Form>
                )}
                </Formik>
            </div>
        )
    }
}
