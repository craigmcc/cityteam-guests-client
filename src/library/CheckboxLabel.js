import React from "react";
import Col from "react-bootstrap/Col";

// CheckboxLabel -------------------------------------------------------------

// The <Col> for the label before an input element.  The label column for
// checkboxes is unique because the actual label will be formatted after the
// checkbox itself, rather than before.

// Incoming Properties -------------------------------------------------------

// label                    Element label text [no label <Col> is rendered]
//                          For a checkbox the label text is not actually
//                          rendered here, but existence triggers the <Col>
// labelClassName           CSS styles for the element label <Col> [col-3]

// Component Details ---------------------------------------------------------

const CheckboxLabel = (props) => {

    return (

        <>
        {props.label ? (
                <Col
                    className={props.labelClassName ? props.labelClassName : "col-3"}/>
            ) : null }
        </>

    )

}

export default CheckboxLabel;
