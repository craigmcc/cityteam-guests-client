import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// CommonError ---------------------------------------------------------------

// Renders two <Col> elements, all within a single <Row>:
// - <Col> spacer for non-existent label (for alignment)
// - <Col> containing the error message itself.

// NOTE:  Nothing is rendered at all if the error message is null or undefined,
// or if touched is false)

// Incoming Properties -------------------------------------------------------

// errorClassName           CSS styles for the overall row element [not rendered]
// errors                   Error message(s) for this field, if any
// fieldClassName           CSS styles for the field <Col> element [col-9]
// labelClassName           CSS styles for the element label <Col>
//                          (not used for content, just for spacing) [col-3]
// message                  Error message to display [No message displayed]
// messageClassName         CSS styles for the error message [alert-warning]
// touched                  Has this field been touched?  [false]

// Component Details ---------------------------------------------------------

const CommonError = (props) => {

    return (

        <>

            {props.errors && props.touched ? (
                <Row
                    className={props.errorClassName ? props.errorClassName : "mb-1 col-12"}
                >
                    <Col
                        className={props.labelClassName ? props.labelClassName : "col-3"}
                    />
                    <Col
                        className={props.fieldClassName ? props.fieldClassName : "col-9"}
                    >
                        <span
                            className={props.messageClassName ? props.messageClassName : "alert-warning"}
                        >
                            {props.errors}
                        </span>
                    </Col>
                </Row>
            ) : null }

        </>

    )

}

export default CommonError;

