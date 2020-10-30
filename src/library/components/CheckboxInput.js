import React from "react";
import Col from "react-bootstrap/Col";

// CheckboxInput -------------------------------------------------------------

// The <Col> for the input element shared by CheckboxElement and CheckboxField.
// NOTES:
//   onBlur/onKeyDown/onChange need to be inherited from <Field> if in a form

// Incoming properties -------------------------------------------------------

// autoFocus                Set automatic focus to this field on render [not set]
// fieldClassName           CSS styles for the field column [col-9]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                Element name (for label mapping) [*REQUIRED*]
// fieldValue               Initially selected field value [not rendered]
// label                    Textual label for this field
// onBlur                   Handle (event) for leaving input element [no handler]
// onChange                 Handle (event) for input element value change [no handler]
// onKeyDown                Handle (event) for key being pressed [no handler]
// withoutInputClassName    Leave off the default className on the input element

// Component Details ---------------------------------------------------------

const CheckboxInput = (props) => {

    return (

        <Col className={props.fieldClassName ? props.fieldClassName : null}>
            <input
                autoFocus={props.autoFocus ? props.autoFocus : null}
                checked={props.fieldValue ? props.fieldValue : false}
                className={props.withoutInputClassName ? null : "mr-2"}
                disabled={props.fieldDisabled ? props.fieldDisabled : null}
                id={props.fieldName ? props.fieldName : "checkbox"}
                name={props.fieldName ? props.fieldName : "checkbox"}
                onBlur={props.onBlur ? props.onBlur : null}
                onChange={props.onChange ? props.onChange : null}
                onKeyDown={props.onKeyDown ? props.onKeyDown : null}
                type="checkbox"
            />
            {props.label ? (
                <label htmlFor={props.fieldName ? props.fieldName : "checkbox"}>
                    {props.label}
                </label>
            ) : null }
        </Col>

    )

}

export default CheckboxInput;
