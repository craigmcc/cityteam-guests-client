import React from "react";
import Col from "react-bootstrap/Col";

// CheckboxLabel -------------------------------------------------------------

// The <Col> for the label before a common input element.  It is rendered only
// if a "label" prop is passed.

// Incoming Properties -------------------------------------------------------

// fieldName                Element name (for label mapping) [*REQUIRED*]
// label                    Element label text [no label <Col> is rendered]
// labelClassName           CSS styles for the element label <Col> [col-3]

// Component Details ---------------------------------------------------------

const CommonLabel = (props) => {

    return (

        <>
            {props.label ? (
                <Col className={props.labelClassName ? props.labelClassName : "col-3"}>
                    <label htmlFor={props.fieldName ? props.fieldName : "common"}>
                        {props.label}
                    </label>

                </Col>
            ) : null }
        </>

    )

}

export default CommonLabel;
