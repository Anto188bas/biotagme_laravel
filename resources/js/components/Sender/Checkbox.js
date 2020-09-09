import React          from "react";
import {Col, Input}   from "reactstrap";
import {Field}        from "formik";

export class Checkbox extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Field name={this.props.name}>
                {({field, form}) => (
                    <Col xs={12} sm={4} md={4} lg={4}>
                        <Input
                            {...field}
                            type     = "checkbox"
                            checked  = {field.value.includes(this.props.value)}
                            onChange = { e => {
                                let cmp_ls = field.value;
                                cmp_ls.includes(this.props.value) ?
                                    cmp_ls = cmp_ls.filter(e => e !== this.props.value) :
                                    cmp_ls.push(this.props.value);
                                form.setFieldValue(this.props.name, cmp_ls);
                            }}
                        /><b><label style={{color:this.props.color}}>{' '}{this.props.value}</label></b>
                    </Col>
                )}
            </Field>
        );
    }
}
