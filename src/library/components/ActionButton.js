import React from "react";
import Button from "react-bootstrap/Button";

// ActionButton --------------------------------------------------------------

// Render a generic button, configured by the specified properties.

// Incoming Properties -------------------------------------------------------

// disabled                 Should this button be disabled? [none]
// label                    Label text [Action]
// onClick                  Handle (event) for a click on this button [none]
// size                     Size of this button (sm, lg) [sm]
// type                     Button type [button]
// variant                  Variant style [warning]

// Component Details ---------------------------------------------------------

export const ActionButton = (props) => {

    return (
        <Button
            disabled={props.disabled ? props.disabled : null}
            onClick={props.onClick ? props.onClick : null}
            size={props.size ? props.size : "sm"}
            type={props.type ? props.type : "button"}
            variant={props.variant ? props.variant : "warning"}
        >
            {props.label ? props.label : "Action"}
        </Button>
    );

}

export default ActionButton;
