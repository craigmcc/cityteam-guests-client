import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { ErrorMessage, Field } from "formik";

// CheckboxField -------------------------------------------------------------

// Renders a Formik-based input checkbox field (with associated label and
// optional error message components), using our Button and Element classes
// under the covers.

// TODO - needs to be remodelled to use CheckboxElement and Formik.

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this field on render [not set]
// errorClassName           CSS styles for error message [alert alert-danger]
// fieldClassName           CSS styles for the field column [col-10]
// label                    Textual label for this field
// labelClassName           CSS styles for label column [col-2]
// name                     Field name in the containing object
// onChange                 Handle (event) when value is changed [no handler]
// type                     Field type [text]

const CheckboxField = (props) => {

//    const [field, meta] = useField(props);
    let errorClassName =
        props.errorClassName ? props.errorClassName : "alert alert-danger";
    let fieldClassName =
        props.fieldClassName ? props.fieldClassName : "col-9";
    let labelClassName =
        props.labelClassName ? props.labelClassName : "col-3";
    let type = props.type ? props.type : "checkbox";

    return (
        <Container fluid>
            <Row className="mb-1">
                {/* Label goes after the checkbox */}
                <Col className={labelClassName}><span/></Col>
                <Col className={fieldClassName}>
                    <Field
                        autoFocus={props.autoFocus ? props.autoFocus : null}
                        className="mr-1"
                        id={props.name}
                        name={props.name}
                        type={type}
                    />
                    <label htmlFor={props.name}>
                        {props.label}
                    </label>
                </Col>
            </Row>
            <Row className="mb-1">
                <Col className={labelClassName}><span/></Col>
                <ErrorMessage
                    className={errorClassName}
                    component="div"
                    name={props.name}
                />
            </Row>
        </Container>
    );
}

export default CheckboxField;
