import React from "react";
import Button from "react-bootstrap/Button";

// SaveButton ----------------------------------------------------------------

// Render a button used to persistently save form information.

// Incoming Properties -------------------------------------------------------

// disabled                 Should this button be disabled? [none]
// label                    Label text [Save]
// onClick                  Handler (event) for a click on this button [none]
// size                     Size of this button (sm, lg) [sm]
// type                     Button type [submit]
// variant                  Variant style [primary]

// Component Details ---------------------------------------------------------

export const SaveButton = (props) => {

    return (
        <Button
            disabled={props.disabled ? props.disabled : null}
            onClick={props.onClick ? props.onClick : null}
            size={props.size ? props.size : "sm"}
            type={props.type ? props.type : "submit"}
            variant={props.variant ? props.variant : "primary"}
        >
            {props.label ? props.label : "Save"}
        </Button>
    );

}

export default SaveButton;
