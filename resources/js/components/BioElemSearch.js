import React from 'react';
import {Col, Container, Card, CardBody, Input, Popover, PopoverHeader, PopoverBody, Row, FormGroup} from 'reactstrap';
import {Formik, Form, Field} from "formik";
import * as Yup from 'yup';

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
                            console.log(form.values.components);
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
        this.toggle = this.toggle.bind(this);
        this.state  = {popoverOpen: false};
    }

    // function used to open or close the popup containing information about the name of the biology element.
    toggle = () => {
        this.setState(
            {popoverOpen: !this.state.popoverOpen,}
        )
    };

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
                        initialValues={{bioElem:'', components:['gene','protein','enzyme','miRNA','LNC','drug','disease']}}
                        validationSchema={this.schema_validation}
                        onSubmit={values => {
                            console.log(values.components);
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
                                {errors.components ? (
                                    <div><p className="text-danger">you have to select one element at least</p></div>
                                ) : null}
                            </FormGroup>
                            <button type="submit" className="btn btn-primary float-right">
                                <i className="fa fa-search" aria-hidden="true"/>
                               Submit
                            </button>
                        </Form>
                            )}
                    </Formik>
                </CardBody>
            </Card>
        );
    }
}
