import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import ActionButton from "../library/components/ActionButton";
import SelectElement from "../library/components/SelectElement";

import * as FacilityClient from "../clients/FacilityClient";
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
        RegistrationClient.assign(
            props.registration.id,
            assigned
        )
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

    const [availableId, setAvailableId] = useState(-1);
    const [availables, setAvailables] = useState([]);

    useEffect(() => {

        const retrieveAvailableRegistrations = () => {
            console.info("CheckinAssignedView.retrieveAvailableRegistrations() for("
                + JSON.stringify(props.registration, Replacers.REGISTRATION)
                + ")");
            FacilityClient.registrationAvailable(
                props.registration.facilityId,
                props.registration.registrationDate
            )
                .then(response => {
                    console.info("CheckinAssignedView.retrieveAvailableRegistrations got("
                        + JSON.stringify(response.data, Replacers.REGISTRATION)
                        + ")");
                    setAvailableId(-1);
                    setAvailables(flattenedRegistrations(response.data));
                })
                .catch(error => {
                    reportError("CheckinAssignedView.retrieveAvailableRegistrations()", error);
                    setAvailableId(-1);
                    setAvailables([]);
                })
        }

        console.info("CheckinAssignedView.useEffect()");
        retrieveAvailableRegistrations();

    }, [props.registration]);

    const availableOptions = () => {
        let results = [];
        results.push({
            description: "(Select)",
            value: 0,
        });
        availables.forEach(choice => {
            results.push({
                description: choice.matNumberAndFeatures,
                value: choice.id,
            });
        });
        return results;
    }

    const flattenedRegistrations = (registrations) => {
        let flattenedItems = registrations;
        for (let flattenedItem of flattenedItems) {
            flattenedItem.matNumberAndFeatures = "" + flattenedItem.matNumber;
            if (flattenedItem.features) {
                flattenedItem.matNumberAndFeatures += flattenedItem.features;
            }
        }
        return flattenedItems;
    }

    const onAvailableChange = (event) => {
        console.info("CheckinAssignedView.onAvailableChange("
            + event.target.value
            + ")");
        setAvailableId(event.target.value);
    }

    const onReassign = () => {
        console.info("CheckinAssignedView.onReassign("
            + JSON.stringify(props.registration, Replacers.REGISTRATION)
            + ", to=" + availableId
            + ")");
        RegistrationClient.reassign(
            props.registration.id,
            availableId
        )
            .then(response => {
                setAvailableId(-1);
                handleStage("List");
            })
            .catch(error => {
                reportError("CheckAssignedView.onReassign()", error);
            })
    }

    // For Option 3 ----------------------------------------------------------

    const [showDeassignConfirm, setShowDeassignConfirm] = useState(false);

    const onDeassignConfirm = () => {
        console.info("CheckinAssignedView.onDeassignConfirm()");
        setShowDeassignConfirm(true);
    }

    const onDeassignConfirmNegative = () => {
        console.info("CheckinAssignedView.onDeassignConfirmNegative()");
        setShowDeassignConfirm(false);
    }

    const onDeassignConfirmPositive = () => {
        console.info("CheckinAssignedView.onDeassignConfirmPositive("
            + JSON.stringify(props.registration, Replacers.REGISTRATION)
            + ")");
        RegistrationClient.deassign(
            props.registration.id
        )
            .then(response => {
                setShowDeassignConfirm(false);
                handleStage("List");
            })
            .catch(error => {
                reportError
                ("CheckinAssignedView.onDeassignConfirmPositive()", error);
            })
    }

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

                <Col className="col-5 mb-1">
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

                <Col className="col-4 bg-light">
                    <>
                        <h6>Option 2: Move Guest To A Different Mat</h6>
                        <hr className="mb-3"/>
                        <Row className="ml-2 mb-3">
                            Move this Guest (and transfer the related assignment
                            details) to a different mat.
                        </Row>
                        <Row className="ml-2 mb-3">
                            <SelectElement
                                fieldName="availableMat"
                                fieldValue={availableId}
                                label={"To Mat:"}
                                onChange={onAvailableChange}
                                options={availableOptions()}
                            />
                        </Row>
                        <Row className="justify-content-center">
                            <ActionButton
                                disabled={availableId <= 0}
                                label="Move"
                                onClick={onReassign}
                                size="sm"
                                variant="info"
                            />
                        </Row>
                    </>
                </Col>

                {/* Option 3 --------------------------------------------- */}

                <Col className="col-3">
                    <>
                        <h6>Option 3: Remove Assignment</h6>
                        <hr className="mb-3"/>
                        <Row className="ml-2 mb-3">
                            Remove the current assignment, erasing any
                            of the details that were specified.
                        </Row>
                        <Row className="mb-5"/>
                        <Row className="justify-content-end">
                            <ActionButton
                                label="Remove"
                                onClick={onDeassignConfirm}
                                variant="danger"
                            />
                        </Row>
                    </>
                </Col>

            </Row>

            {/* Option 3 Confirm Modal ----------------------------------- */}

            <Modal
                animation={false}
                backdrop="static"
                centered
                onHide={onDeassignConfirmNegative}
                show={showDeassignConfirm}
                size="lg"
            >

                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deassign</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Do you really want to remove this assignment
                        and erase the assignment details (including which
                        Guest was assigned to this mat)?
                    </p>
                    <p>
                        If you just want to move an assigned Guest to a
                        different available mat, use Option 2 instead.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <ActionButton
                        label="Confirm"
                        onClick={onDeassignConfirmPositive}
                        variant="danger"
                    />
                    <ActionButton
                        label="Cancel"
                        onClick={onDeassignConfirmNegative}
                        variant="primary"
                    />
                </Modal.Footer>

            </Modal>

            {/* Common Footer -------------------------------------------- */}

            <Row>
                <Col className="col-11">
                    <Row className="justify-content-center">
                        Click&nbsp;<span className="text-primary">Back</span>&nbsp;
                        to return the the list with no changes.
                    </Row>
                </Col>
                <Col className="col-1"/>
            </Row>

        </Container>


    )

}

export default CheckinAssignedView;
