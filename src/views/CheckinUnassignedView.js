import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import List from "../library/components/List";
import Pagination from "../library/components/Pagination";
import SearchBar from "../library/components/SearchBar";

import * as FacilityClient from "../clients/FacilityClient";
import * as GuestClient from "../clients/GuestClient";
import { FacilityContext } from "../contexts/FacilityContext";
import AssignForm from "../forms/AssignForm";
import GuestForm from "../forms/GuestForm";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";
import * as RegistrationClient from "../clients/RegistrationClient";
import ActionButton from "../library/components/ActionButton";
import * as Transformations from "../util/Transformations";

// CheckinUnassignedView -----------------------------------------------------

// Provide a two step process to deal with a Registration that has not yet
// been assigned a Guest:
// - Select a Guest to assign, or create a new one.
// - Assign the Guest, filling in assignment details.

// Incoming Properties -------------------------------------------------------

// handleStage              Handle (string) to request a different stage [*REQUIRED*]
// registration             Currently unassigned Registration [*REQUIRED*]
// selectedDate             Checkin date we are handling [*REQUIRED]

// Component Details ---------------------------------------------------------

const CheckinUnassignedView = (props) => {

    // General Support -------------------------------------------------------

    const [assign, setAssign] = useState(null);
    const [guest, setGuest] = useState(null);

    const handleStage = (newStage) => {
        console.info("CheckinUnassignedView.handleStage(" + newStage + ")");
        if (props.handleStage) {
            props.handleStage(newStage);
        } else {
            alert("CheckinUnassignedView: Programming error, no handleStage defined, "
                + "so no stage change is possible.");
        }
    }

    const onBack = () => {
        console.info("CheckinUnassignedView.onBack()");
        handleStage("List");
    }

    // For Step 1 ------------------------------------------------------------

    const facilityContext = useContext(FacilityContext);

    const [adding, setAdding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [guests, setGuests] = useState([]);
    const [index, setIndex] = useState(-1)
    const [pageSize] = useState(10);
    const [registrations, setRegistrations] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.info("CheckinUnassignedView.useEffect()");
        retrieveRegistrations(props.selectedDate);
    }, [FacilityContext.selectedFacility, props.selectedDate]);

    const emptyGuestValues = () => {
        return {
            id: -1,
            active: true,
            comments: "",
            facilityId: -1,
            firstName: "",
            lastName: "",
        }
    }

    const flattenedRegistrations = (registrations) => {
        let flattenedItems =
            Transformations.withFlattenedObjects(registrations, "guest");
        for (let flattenedItem of flattenedItems) {
            flattenedItem.matNumberAndFeatures = "" + flattenedItem.matNumber;
            if (flattenedItem.features) {
                flattenedItem.matNumberAndFeatures += flattenedItem.features;
            }
        }
        return flattenedItems;
    }

    const handleAddSave = (newGuest) => {
        newGuest.facilityId = facilityContext.selectedFacility.id;
        GuestClient.insert(newGuest)
            .then(response => {
                console.info("CheckinUnassignedView.handleAddSave("
                    + JSON.stringify(response.data, Replacers.GUEST)
                    + ")");
                setCurrentPage(1);
//                retrieveGuests(searchText, 1);
                setAdding(false);
                setGuest(response.data);
                setIndex(-1);
                configureAssign(response.data);
            })
            .catch(error => {
                reportError("CheckinUnassignedView.handleAddSave()", error);
            })
    }

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("CheckinUnassignedView.handleIndex(-1)");
            configureAssign(null);
            setGuest(null);
            setIndex(-1);
        } else {
            let matNumber = -1;
            registrations.forEach(check => {
                if (check.guestId && (check.guestId === guests[newIndex].id)) {
                    matNumber = check.matNumber;
                }
            })
            if (matNumber >= 0) {
                alert("This Guest is already assigned to mat " + matNumber
                    + ".  Multiple assignments of the same Guest, "
                    + " on the same date, are not allowed.")
            } else {
                console.info("CheckinUnassignedView.handleIndex("
                    + newIndex + ", "
                    +JSON.stringify(guests[newIndex], Replacers.GUEST)
                    + ")");
                configureAssign(guests[newIndex]);
                setGuest(guests[newIndex]);
                setIndex(newIndex);
            }
        }
    }

    const listFields = [
        "firstName",
        "lastName",
        "active",
        "comments",
    ];

    const listHeaders = [
        "First Name",
        "Last Name",
        "Active",
        "Comments",
    ];

    const onAddClick = () => {
        console.info("CheckinUnassignedView.onAddClick()");
        setAdding(true);
        setCurrentPage(1);
        setGuest(null);
        setIndex(-1);
    }

    const onPageNext = () => {
        console.info("CheckinUnassignedView.onPageNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onPagePrevious = () => {
        console.info("CheckinUnassignedView.onPagePrevious()");
        let newCurrentPage = currentPage - 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onSearchChange = (event) => {
        console.info("CheckinUnassignedView.onSearchChange("
            + event.target.value
            + ")");
        setCurrentPage(1);
        setSearchText(event.target.value);
        retrieveGuests(event.target.value, currentPage);
    }

    const retrieveGuests = (newSearchText, newCurrentPage) => {
        console.info("CheckinUnassignedView.retrieveGuests for("
            + newSearchText + ", "
            + newCurrentPage + ")");
        if (!newSearchText) {
            setGuests([]);
            return;
        }
        FacilityClient.guestName(
            props.registration.facilityId,
            newSearchText,
            {
                limit: pageSize,
                offset: (pageSize * (newCurrentPage - 1))
            }
        )
            .then(response => {
                    console.info("CheckinUnassignedView.retrieveGuests got("
                        + JSON.stringify(response.data, Replacers.GUEST)
                        + ")");
                    setGuests(response.data);
                }
            )
            .catch(error => {
                reportError("CheckinUnassignedView.retrieveGuests()", error);
            })
    }

    const retrieveRegistrations = (newSelectedDate) => {
        if (facilityContext.selectedFacility.id <= 0) {
            setRegistrations([]);
            return;
        }
        FacilityClient.registrationDate(
            facilityContext.selectedFacility.id,
            newSelectedDate,
            { withGuest: "" }
        )
            .then(response => {
                let newRegistrations = flattenedRegistrations(response.data);
                console.info("CheckinUnassignedView.retrieveRegistrations("
                    + JSON.stringify(newRegistrations, Replacers.REGISTRATION)
                    + ")");
                setRegistrations(newRegistrations);
            })
            .catch(error => {
                reportError("CheckinUnassignedView.retrieveRegistrations()", error);
            });
    }

    // For Step 2 ------------------------------------------------------------

    const configureAssign = (newGuest) => {
        console.info("CheckinUnassignedView.configureAssign for("
            + JSON.stringify(newGuest, Replacers.GUEST)
            + ")");
        let newAssign;
        if (newGuest) {
            newAssign = {
                id: props.registration.id,
                comments: null,
                facilityId: newGuest.facilityId,
                guestId: newGuest.id,
                paymentAmount: "5.00",
                paymentType: "$$",
                showerTime: null,
                wakeupTime: null,
            }
        } else {
            newAssign = null;
        }
        console.info("CheckinUnassignedView.configureAssign got("
            + JSON.stringify(newAssign, Replacers.REGISTRATION)
            + ")");
        setAssign(newAssign);
    }

    const handleAssign = (assigned) => {
        RegistrationClient.assign(
            props.registration.id,
            assigned
        )
            .then(response => {
                console.info("CheckinUnassignedView.handleAssign("
                    + JSON.stringify(response.data, Replacers.REGISTRATION)
                    + ")");
                handleStage("List")
            })
            .catch(error => {
                reportError("CheckinUnassignedView.handleAssign()", error);
            })
    }

    return (

        <Container fluid>

            {/* Common Header -------------------------------------------- */}

            <Row className="mb-2">
                <Col className="col-11">
                    { props.registration ? (
                        <>
                            <Row className="justify-content-center">
                                Mat Number:&nbsp;
                                <span className="text-info">
                                    {props.registration.matNumberAndFeatures}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                                { (guest) ? (
                                    <span>
                                        Guest:&nbsp;
                                        <span className="text-info">
                                            {guest.firstName}&nbsp;
                                            {guest.lastName}
                                        </span>
                                    </span>
                                ) : null }
                            </Row>
                        </>
                    ) : (
                        <span>No mats are currently available on this date.</span>
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

                {/* Step 1 --------------------------------------------------- */}

                <Col className="col-7 bg-light mb-1 mt-1">
                    <>

                        <h6>Step 1: Select or Add A Guest To Assign</h6>
                        <hr className="mb-3"/>

                        <Row className="mb-3">
                            <Col className="col-4">
                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={(guests.length === 0) ||
                                        (guests.length < pageSize)}
                                    onNext={onPageNext}
                                    onPrevious={onPagePrevious}
                                />
                                &nbsp;
                                <ActionButton
                                    className="ml-3"
                                    label="Add"
                                    onClick={onAddClick}
                                    size="sm"
                                    variant="secondary"
                                />
                            </Col>
                            <Col className="col-8">
                                <SearchBar
                                    autoFocus
                                    fieldClassName="col-12"
                                    fieldValue={searchText}
                                    onChange={onSearchChange}
                                    placeholder="Enter all or part of either name ..."
                                    // withAction
                                    // withClear
                                />
                            </Col>
                        </Row>

                        { (adding) ? (

                            <Row className="ml-1 mr-1 mb-2">
                                <GuestForm
                                    autoFocus
                                    guest={emptyGuestValues()}
                                    handleInsert={handleAddSave}
                                    saveLabel="Add"
                                    withoutActive
                                    withoutRemove
                                />
                            </Row>

                        ) : (

                            <Row className="ml-1 mr-1 mb-2">
                                <List
                                    fields={listFields}
                                    handleIndex={handleIndex}
                                    headers={listHeaders}
                                    hover
                                    index={index}
                                    items={guests}
                                />
                            </Row>

                        )}

                    </>
                </Col>

                {/* Step 2 --------------------------------------------------- */}

                <Col className="col-5 mb-1 mt-1">
                    <>
                        <h6>Step 2: Complete Assignment Details</h6>
                        <hr className="mb-3"/>
                        { (assign) ? (
                            <AssignForm
                                assign={assign}
                                autoFocus
                                handleAssign={handleAssign}
                                saveLabel="Complete"
                            />
                        ) : (
                            <span>No guest has been selected for assignment yet</span>
                        )}
                    </>
                </Col>

            </Row>

        </Container>

    )

}

export default CheckinUnassignedView;
