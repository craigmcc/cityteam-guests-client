import React from "react";
import Col from "react-bootstrap/Col";
import ActionButton from "./ActionButton";

// CheckboxAction ------------------------------------------------------------

// The <Col> for the action button after a common input element.  It is
// rendered only if an "action" prop is passed.

// Incoming Properties -------------------------------------------------------

// action                   Action button text [no action <Col> is rendered]
// actionClassName          CSS styles for the action button <Col> element [not rendered]
// actionDisabled           Mark action button as disabled [not rendered]
// actionSize               Action button size ("lg", "sm") [sm]
// actionVariant            Action style variant [not rendered]
// onClick                  Handle (event) for action button click [no handler]

// Component Details ---------------------------------------------------------

const CommonAction = (props) => {

    return (

        <>
            {props.action ? (
                <Col className={props.actionClassName ? props.actionClassName : null}>
                    <ActionButton
                        disabled={props.actionDisabled ? props.actionDisabled : null}
                        label={props.action}
                        onClick={props.onClick ? props.onClick : null}
                        size={props.actionSize ? props.actionSize : "sm"}
                        variant={props.actionVariant ? props.actionVariant : null}
                    />
                </Col>
            ) : null }
        </>

    )

}

export default CommonAction;
