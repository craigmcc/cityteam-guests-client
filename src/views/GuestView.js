import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
// import GuestForm from "../forms/GuestForm";
import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import Pagination from "../library/components/Pagination";
import SearchBar from "../library/components/SearchBar";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";

// GuestView -----------------------------------------------------------------

// Top-level view for administering Guests.

// Component Details ---------------------------------------------------------

const GuestView = () => {

    const facilityContext = useContext(FacilityContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [index, setIndex] = useState(-1);
    const [guest, setGuest] = useState(null);
    const [guests, setGuests] = useState([]);
    const [pageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        console.info("GuestView.useEffect()");
        retrieveAllGuests();
        setIndex(-1);
        setSearchText("")
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility]);

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("GuestView.handleIndex(-1)");
            setIndex(-1);
            setShow(false);
            setGuest(null);
        } else {
            console.info("GuestView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(guests[newIndex], Replacers.GUEST)
                + ")");
            setIndex(newIndex);
            setShow(true);
            setGuest(guests[newIndex]);
        }
    }

    const handleInsert = (guest) => {
        console.info("GuestView.handleInsert("
            + JSON.stringify(guest, Replacers.GUEST)
            + ")");
        setShow(false);
        retrieveGuests(searchText);
    }

    const handleRemove = (guest) => {
        console.info("GuestView.handleRemove("
            + JSON.stringify(guest, Replacers.GUEST)
            + ")");
        setShow(false);
        retrieveGuests(searchText);
    }

    const handleUpdate = (guest) => {
        console.info("GuestView.handleUpdate("
            + JSON.stringify(guest, Replacers.GUEST)
            + ")");
        setShow(false);
        retrieveGuests(searchText);
    }

    const onAdd = () => {
        console.info("GuestView.onAdd()");
        setGuest(null);
        setShow(true);
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

    const onHide = () => {
        console.info("GuestView.onHide()");
        setIndex(-1);
        setShow(false);
    }

    const onNext = () => {
        console.info("GuestView.onNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onPrevious = () => {
        console.info("GuestView.onNext()");
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
                        fields={["firstName", "lastName",
                            "active", "comments"]}
                        // footer
                        handleIndex={handleIndex}
                        headers={["First Name", "Last Name",
                            "Active", "Comments About Guest"]}
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

            </Container>
        </>

    )

}

export default GuestView;
