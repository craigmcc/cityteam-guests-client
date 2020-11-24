import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import Pagination from "../library/components/Pagination";
import SearchBar from "../library/components/SearchBar";

import * as FacilityClient from "../clients/FacilityClient";
import * as GuestClient from "../clients/GuestClient";
import { FacilityContext } from "../contexts/FacilityContext";
import GuestForm from "../forms/GuestForm";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";

// GuestView -----------------------------------------------------------------

// Top-level view for administering Guests.

// Component Details ---------------------------------------------------------

const GuestView = () => {

    const facilityContext = useContext(FacilityContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [guest, setGuest] = useState(null);
    const [guests, setGuests] = useState([]);
    const [index, setIndex] = useState(-1);
    const [pageSize] = useState(10);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.info("GuestView.useEffect()");
        retrieveAllGuests();
        setIndex(-1);
        setSearchText("")
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility]);

    const emptyValues = () => {
        return {
            id: -1,
            active: true,
            comments: "",
            facilityId: -1,
            firstName: "",
            lastName: "",
        }
    }

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("GuestView.handleIndex(-1)");
            setGuest(null);
            setIndex(-1);
        } else {
            console.info("GuestView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(guests[newIndex], Replacers.GUEST)
                + ")");
            setGuest(guests[newIndex]);
            setIndex(newIndex);
        }
    }

    const handleInsert = (inserted) => {
        inserted.facilityId = facilityContext.selectedFacility.id;
        GuestClient.insert(inserted)
            .then(response => {
                console.info("GuestView.handleInsert("
                    + JSON.stringify(response.data, Replacers.GUEST)
                    + ")");
                retrieveGuests(searchText, currentPage);
                setGuest(null);
                setIndex(-1);
            })
            .catch(error => {
                reportError("GuestView.handleInsert()", error);
            })
    }

    const handleRemove = (removed) => {
        removed.facilityId = facilityContext.selectedFacility.id;
        GuestClient.remove(removed.id)
            .then(response => {
                console.info("GuestView.handleRemove("
                    + JSON.stringify(response.data, Replacers.GUEST)
                    + ")");
                retrieveGuests(searchText, currentPage);
                setGuest(null);
                setIndex(-1);
            })
            .catch(error => {
                reportError("GuestView.handleRemove()", error);
            })
    }

    const handleUpdate = (updated) => {
        updated.facilityId = facilityContext.selectedFacility.id;
        GuestClient.update(updated.id, updated)
            .then(response => {
                console.info("GuestView.handleUpdate("
                    + JSON.stringify(response.data, Replacers.GUEST)
                    + ")");
                retrieveGuests(searchText, currentPage);
                setGuest(null);
                setIndex(-1);
            })
            .catch(error => {
                reportError("GuestView.handleUpdate()", error);
            })
    }

    const listFields = [
        "firstName",
        "lastName",
        "active",
        "comments",
        "favorite",
    ]

    const listHeaders = [
        "First Name",
        "Last Name",
        "Active",
        "Comments",
        "Fav. Mat",
    ]

    const onAdd = () => {
        console.info("GuestView.onAdd()");
        setGuest(emptyValues());
        setIndex(-1);
    }

    const onBack = () => {
        console.info("GuestView.onBack()");
        setGuest(null);
        setIndex(-1);
    }

    const onChange = (event) => {
        console.info("GuestView.onChange(" + event.target.value + ")");
        setSearchText(event.target.value);
        retrieveGuests(event.target.value, currentPage);
    }

    const onClick = () => {
        console.info("GuestView.onClick()");
        retrieveGuests(searchText, currentPage);
    }

    const onNext = () => {
        console.info("GuestView.onNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onPrevious = () => {
        console.info("GuestView.onPrevious()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const retrieveAllGuests = () => {
        setCurrentPage(1);
        setGuests([]);
        setIndex(-1);
    }

    const retrieveGuests = (newSearchText, newCurrentPage) => {
        if (newSearchText === "") {
            retrieveAllGuests();
        } else {
            retrieveMatchingGuests(newSearchText, newCurrentPage);
            setIndex(-1);
        }
    }

    const retrieveMatchingGuests = (newSearchText, newCurrentPage) => {
        console.info("GuestView.retrieveMatchingGuests for("
            + JSON.stringify(facilityContext.selectedFacility.name, Replacers.FACILITY)
            + ", searchText=" + newSearchText
            + ", currentPage=" + newCurrentPage
            + ")");
        FacilityClient.guestName(
            facilityContext.selectedFacility.id,
            newSearchText,
            {
                limit: pageSize,
                offset: (pageSize * (newCurrentPage - 1))
            })
                .then(response => {
                    console.info("GuestView.retrieveMatchingGuests got("
                        + JSON.stringify(response.data,Replacers.GUEST)
                        + ")");
                    setGuests(response.data);
                    setIndex(-1);
                })
                .catch(error => {
                    reportError("GuestView.retrieveMatchingGuests()", error);
                });
    }


    return (

        <>

            <Container fluid id="GuestView">

                {(!guest) ? (

                    <>

                        {/* List View */}
                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="col-4">
                                <strong className="mr-3">
                                    Guests for {facilityContext.selectedFacility.name}
                                </strong>
                                <ActionButton
                                    label="Add"
                                    onClick={onAdd}
                                    variant="primary"
                                />
                            </Col>
                            <Col className="col-8">
                                <SearchBar
                                    fieldName="searchText"
                                    fieldValue={searchText}
                                    onChange={onChange}
                                    onClick={onClick}
                                    placeholder="Search by all or part of either name ..."
                                    // withAction
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col>
                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={(guests.length === 0) ||
                                    (guests.length < pageSize)}
                                    onNext={onNext}
                                    onPrevious={onPrevious}
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1">
                            <List
                                bordered
                                fields={listFields}
                                // footer
                                handleIndex={handleIndex}
                                headers={listHeaders}
                                hover
                                index={index}
                                items={guests}
                                striped
                            />
                        </Row>

                        <Row className="ml-1 mr-1">
                            Click &nbsp;<strong>Add</strong>&nbsp; for a new Guest, or
                            click on a row in the table to edit an existing one.
                        </Row>

                    </>

                ) : null }

                {(guest) ? (

                    <>

                        {/* Form View */}
                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(guest.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;Guest for {facilityContext.selectedFacility.name}
                                    </>
                                </strong>
                            </Col>
                            <Col className="text-right">
                                <ActionButton
                                    label="Back"
                                    onClick={onBack}
                                    variant="primary"
                                />
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="col-sm-8">
                                <GuestForm
                                    autoFocus={true}
                                    guest={guest}
                                    handleInsert={handleInsert}
                                    handleRemove={handleRemove}
                                    handleUpdate={handleUpdate}
                                    onConfirmNegative={onBack}
                                />
                            </Col>
                        </Row>

                    </>

                ) : null }

            </Container>
        </>

    )

}

export default GuestView;
