import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { ErrorMessage, Field } from "formik";

// SelectField ---------------------------------------------------------------

// Renders a Formik-based input select field (with associated label and
// optional error message components), using our Button and Element classes
// under the covers.

// TODO - needs to be remodelled to use SelectElement and Formik.

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this field on render [not set]
// errorClassName           CSS styles for error message [alert alert-danger]
// fieldClassName           CSS styles for the field column [col-9]
// label                    Textual label for this field
// labelClassName           CSS styles for label column [col-3]
// name                     Field name in the containing object
// options                  Array of options with "value" and "description" fields
// value                    Currently selected value

// Component Details ---------------------------------------------------------

const SelectField = (props) => {

//    const [field, meta] = useField(props);
    const [options] = useState(props.options);

    let errorClassName =
        props.errorClassName ? props.errorClassName : "alert alert-danger";
    let fieldClassName =
        props.fieldClassName ? props.fieldClassName : "col-9";
    let labelClassName =
        props.labelClassName ? props.labelClassName : "col-3";

    return (
        <Container fluid>
            <Row className="mb-1">
                <Col className={labelClassName}>
                    <label htmlFor={props.name}>
                        {props.label}
                    </label>
                </Col>
                <Field
                    as="select"
                    autoFocus={props.autoFocus ? props.autoFocus : null}
                    className={fieldClassName}
                    id={props.name}
                    name={props.name}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.description}
                        </option>

                    ))}
                </Field>
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

export default SelectField;
