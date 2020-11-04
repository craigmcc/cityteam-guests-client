import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
//import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import ActionButton from "../library/components/ActionButton";

import * as RegistrationClient from "../clients/RegistrationClient";
import AssignForm from "../forms/AssignForm";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";

// CheckinAssignedView -------------------------------------------------------

// Provide three options to deal with a Registration that has already been
// assigned a Guest:
// - Edit the existing assignment details
// - Move the assigned Guest to a different mat
// - Remove the existing assignment

// Incoming Properties -------------------------------------------------------

// registration             Currently assigned Registration [*REQUIRED*]
// handleStage              Handle (string) to request a different stage [*REQUIRED*]

// Component Details ---------------------------------------------------------

const CheckinAssignedView = (props) => {

    // General Support -------------------------------------------------------

    const handleStage = (newStage) => {
        console.info("CheckinAssignedView.handleStage(" + newStage + ")");
        if (props.handleStage) {
            props.handleStage("List");
        } else {
            alert("CheckinAssignedView: Programming error, no handleStage defined, "
                + "so no stage change is possible.");
        }
    }

    const onBack = () => {
        console.info("CheckinAssignedView.handleBack()");
        handleStage("List");
    }

    // For Option 1 ----------------------------------------------------------

    const extractAssign = (registration) => {
        return Transformations.toEmptyStrings({
            id: registration.id,
            comments: registration.comments,
            guestId: registration.guestId,
            paymentAmount: registration.paymentAmount,
            paymentType: registration.paymentType,
            showerTime: registration.showerTime,
            wakeupTime: registration.wakeupTime
        });
    }

    const handleAssign = (assigned) => {
        RegistrationClient.assign(props.registration.id, assigned)
            .then(response => {
                console.info("AssignForm.handleAssign("
                    + JSON.stringify(response.data, Replacers.REGISTRATION)
                    + ")");
                handleStage("List")
            })
            .catch(error => {
                reportError("CheckinAssignedView.handleAssign()", error);
            })
    }

    // For Option 2 ----------------------------------------------------------

    // For Option 3 ----------------------------------------------------------

    // Rendered Output -------------------------------------------------------

    return (

        <Container fluid>

            {/* Common Header -------------------------------------------- */}

            <Row className="mb-4">

                <Col className="col-11">
                    { (props.registration && props.registration.guest) ? (
                        <>
                            <Row className="justify-content-center">
                                Mat Number:&nbsp;
                                <span className="text-info">
                                    {props.registration.matNumberAndFeatures}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                                Guest:&nbsp;
                                <span className="text-info">
                                    {props.registration.guest.firstName}&nbsp;
                                    {props.registration.guest.lastName}
                                </span>
                            </Row>
                        </>
                    ) : (
                        <span>No registration or guest yet</span>
                    )}

                </Col>

                <Col className="col-1">
                    <ActionButton
                        label="Back"
                        onClick={onBack}
                        size="sm"
                        variant="outline-primary"
                    />
                </Col>
            </Row>

            <Row className="mb-3 ml-1 mr-1">

                {/* Option 1 --------------------------------------------- */}

                <Col className="col-7 mb-1">
                    <>
                        <h6>Option 1: Edit Assignment Details</h6>
                        <hr className="mb-3"/>
                        { (props.registration && props.registration.guest) ? (
                            <AssignForm
                                assign={extractAssign(props.registration)}
                                autoFocus={true}
                                handleAssign={handleAssign}
                            />
                        ) : (
                            <span>No registration or guest yet</span>
                        )}
                    </>
                </Col>

                {/* Option 2 --------------------------------------------- */}

                <Col className="col-3 bg-light">
                </Col>

                {/* Option 3 --------------------------------------------- */}

                <Col className="col-2">
                </Col>

            </Row>

        </Container>


    )

}

export default CheckinAssignedView;
