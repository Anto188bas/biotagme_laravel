import React from 'react';
import {Col, Container, Card, CardBody, Input, Popover, PopoverHeader,
        PopoverBody, Row, FormGroup, Collapse, Spinner} from 'reactstrap';
import {Formik, Form, Field} from "formik";
import * as Yup from 'yup';
import NavUploader from "./NavUploader";
import axios from "axios";

Echo.channel('import')
    .listen('.CSVimportEvent', ev => console.log(ev));

function Checkbox(props) {
    return (
        <Field name={props.name}>
            {({field, form}) => (
                <Col xs={12} sm={4} md={4} lg={4}>
                    <Input
                        {...field}
                        type="checkbox"
                        checked={field.value.includes(props.value)}
                        onChange={ e => {
                            let cmp_ls = field.value;
                            cmp_ls.includes(props.value) ? cmp_ls = cmp_ls.filter(e => e !== props.value) : cmp_ls.push(props.value);
                            form.setFieldValue(props.name, cmp_ls);
                        }}
                    />{' '}{props.value}
                </Col>
            )}
        </Field>
    );
}

export default class BioElemSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            navUploaderOpen: false,
            spinnerRun:false
        };
        this.toggle      = this.toggle.bind(this);
        this.newNavState = this.newNavState.bind(this);
        this.newSpinSt   = this.newSpinSt.bind(this);
    }

    // function used to open or close the popup containing information about the name of the biology element.
    toggle      = () => {this.setState({popoverOpen: !this.state.popoverOpen,})};
    newNavState = () => {this.setState({navUploaderOpen: !this.state.navUploaderOpen,})};
    newSpinSt   = () => {this.setState({spinnerRun: !this.state.spinnerRun})};

   schema_validation = Yup.object().shape({
        bioElem: Yup.string()
            .required('Required'),
        components: Yup.array()
            .min(1)
    });

   render() {
        return (
            <Card className="card">
                <CardBody className="card-body">
                    <Formik
                        initialValues={
                            {
                                bioElem:'',
                                components:['gene','protein','enzyme','miRNA','LNC','drug','disease'],
                                top_n:'10'
                            }
                        }
                        validationSchema={this.schema_validation}
                        onSubmit={values => {
                            const this_cl = this;
                            this_cl.newSpinSt();
                            console.log(values.components);
                            axios.post('/searchElements', {
                                names: values.bioElem.toString().split(","),
                                top_n: values.top_n,
                                elements: values.components
                            }).then(function (response){
                                this_cl.props.nodes(response.data.response);
                                this_cl.newSpinSt()
                            }).catch(function (error) {
                               console.log(error);   // da riportare sul componente
                               this_cl.newSpinSt();
                            })
                        }}
                    >
                        {({values, handleChange, errors}) => (
                            <Form>
                                <FormGroup>
                                    <legend>Biological element name</legend>
                                    <Input type="textarea"
                                           name="bioElem"
                                           id="biologyText"
                                           value={values.bioElem}
                                           onChange={handleChange}
                                    />
                                    {errors.bioElem ? (<div><p className="text-danger">{errors.bioElem}</p></div>) : null}
                                    <Popover placement="bottom"
                                             trigger="hover"
                                             isOpen={this.state.popoverOpen}
                                             target="biologyText"
                                             toggle={this.toggle}
                                    >
                                        <PopoverHeader>Information</PopoverHeader>
                                        <PopoverBody>
                                            You have to insert a biological element name or a comma-separated ones
                                        </PopoverBody>
                                    </Popover>
                                </FormGroup>
                                <FormGroup>
                                    <legend>Biological elements</legend>
                                    <Container>
                                        <Row>
                                            <Checkbox name="components" value="gene"/>
                                            <Checkbox name="components" value="protein"/>
                                            <Checkbox name="components" value="enzyme"/>
                                        </Row>
                                        <Row>
                                            <Checkbox name="components" value="miRNA"/>
                                            <Checkbox name="components" value="LNC"/>
                                            <Checkbox name="components" value="drug"/>
                                        </Row>
                                        <Row>
                                            <Checkbox name="components" value="disease"/>
                                        </Row>
                                    </Container>
                                    <br/>
                                    <legend>Top n</legend>
                                    <Input type="select" name="top_n" value={values.top_n} onChange={handleChange}>
                                        {
                                            Array.from(Array(5).keys()).map((v,idx) =>
                                                <option key={idx}>{(v+1)*10}</option>
                                         )}
                                    </Input>
                                    {errors.components ? (
                                        <div><p className="text-danger">you have to select one element at least</p></div>
                                    ) : null}
                                </FormGroup>
                                {
                                    this.state.spinnerRun ?
                                        <Spinner color='primary' style={{float:'right'}}/> :
                                        <button type="submit" className="btn btn-primary" style={{float:'right'}}>Submit</button>
                                }
                            </Form>
                        )}
                    </Formik>
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
