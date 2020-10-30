import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import * as GuestClient from "../clients/GuestClient";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import { FacilityContext } from "../contexts/FacilityContext";
import Pagination from "../components/Pagination";
import ActionButton from "../library/components/ActionButton";
import { reportError } from "../util/error.handling";


// GuestHistoryReport --------------------------------------------------------

// Top-level view for Guest History Report.

// Component Details ---------------------------------------------------------

const GuestHistoryReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [guest, setGuest] = useState(null);
    const [guests, setGuests] = useState([]);
    const [heading, setHeading] = useState("");
    const [index, setIndex] = useState(-1);
    const [pageSize] = useState(30);
    const [registrations, setRegistrations] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.info("GuestHistoryReport.useEffect()");
        retrieveAllGuests();
    }, [facilityContext.selectedFacility]);


    const handleSelectedIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("GuestHistoryReport.handleSelectedIndex(-1)");
            setGuest(null);
            setIndex(-1);
        } else {
            console.info("GuestHistoryReport.handleSelectedIndex("
                + newIndex + ", "
                + JSON.stringify(guests[newIndex], ["id", "firstName", "lastName"])
                + ")");
            retrieveRegistrations(guests[newIndex]);
            setHeading("Guest History for " +
                facilityContext.selectedFacility.name +
                " Guest " + guests[newIndex].firstName +
                " " + guests[newIndex].lastName);
            setGuest(guests[newIndex]);
            setIndex(newIndex);
        }
    }

    const onBack = () => {
        console.info("GuestHistoryReport.onBack()");
        setGuest(null);
        setHeading("");
    }

    const onPageNext = () => {
        console.info("GuestHistoryReport.onPageNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onPagePrevious = () => {
        console.info("GuestHistoryReport.onPagePrevious()");
        let newCurrentPage = currentPage - 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onSearchChange = (event) => {
        console.info("GuestHistoryReport.onSearchChange("
            + event.target.value
            + ")");
        setCurrentPage(1);
        setSearchText(event.target.value);
        retrieveGuests(event.target.value, currentPage);
    }

    const onSearchClick = () => {
        console.info("GuestHistoryReport.onSearchClick("
            + searchText
            + ")");
        retrieveGuests(searchText, currentPage);
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
        }
    }

    const retrieveMatchingGuests = (newSearchText, newCurrentPage) => {
        console.info("GuestHistoryReport.retrieveMatchingGuests for("
            + JSON.stringify(facilityContext.selectedFacility,["id", "name"])
            + ", " + newSearchText
            + ", " + newCurrentPage
            + ")");
        FacilityClient.guestName(facilityContext.selectedFacility.id, newSearchText,
                {
                    limit: pageSize,
                    offset: (pageSize * (newCurrentPage - 1))
                })
            .then(response => {
                console.info("GuestHistoryReport.retrieveMatchingGuests got("
                    + JSON.stringify(response.data,["id", "firstName", "lastName"])
                    + ")");
                setGuests(response.data);
            })
            .catch(error => {
                reportError("GuestHistoryReport.retrieveMatchingGuests()", error);
            });
        setIndex(-1);
    }

    const retrieveRegistrations = (newGuest) => {
        console.info("GuestHistoryReport.retrieveRegistrations for("
            + JSON.stringify(newGuest, ["id", "firstName", "lastName"])
            + ")");
        GuestClient.registrationAll(newGuest.id)
            .then(response => {
                for (let registration of response.data) {
                    registration.matNumberAndFeatures =  "" + registration.matNumber;
                    if (registration.features) {
                        registration.matNumberAndFeatures += registration.features;
                    }
                }
                console.info("GuestHistoryReport.retrieveRegistrations got(" +
                    JSON.stringify(response.data,
                        ["id", "registrationDate", "matNumberAndFeatures"]));
                setRegistrations(response.data);
            })
            .catch(error => {
                console.error("GuestHistoryReport.retrieveRegistrations() error", error);
                alert(`GuestHistory.retrieveRegistrations() error: '${error.message}`);
            })
    }

    return (

        <>

            <Container fluid id="GuestHistoryReport">

                { (!guest) ? (

                    <>

                        <Row className="mb-3">
                            <Col className="col-4">
                                <strong>Guest History for {facilityContext.selectedFacility.name}</strong>
                            </Col>
                            <Col className="col-8">
                                <SearchBar
                                    fieldName="searchByName"
                                    fieldValue={searchText}
                                    onChange={onSearchChange}
                                    onClick={onSearchClick}
                                    placeholder="Enter all or part of either name ..."
                                    //                                    withAction
                                    //                                    withClear
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={(guests.length === 0) ||
                                        (guests.length < pageSize)}
                                    onNext={onPageNext}
                                    onPrevious={onPagePrevious}
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1">
                            <List
                                bordered
                                fields={["firstName", "lastName",
                                    "active", "comments"]}
                                // footer
                                handleIndex={handleSelectedIndex}
                                headers={["First Name", "Last Name",
                                    "Active", "Comments About Guest"]}
                                hover
                                index={index}
                                items={guests}
                                striped
                            />
                        </Row>

                        <Row className="mb-2 ml-1">
                            Enter all or part of either name to select the
                            Guest for which you wish to retrieve Guest History.
                        </Row>

                    </>

                ) : (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                Report Date:&nbsp;
                                {(new Date()).toLocaleString()}
                            </Col>
                            <Col className="text-right">
                                <ActionButton
                                    label="Back"
                                    onClick={onBack}
                                    variant="primary"
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1">
                            <List
                                bordered
                                fields={["registrationDate",
                                    "matNumberAndFeatures",
                                    "paymentType",
                                    "paymentAmount", "showerTime",
                                    "wakeupTime", "comments"]}
                                footer
                                headers={["Date", "Mat", "$$", "Amount",
                                    "Shower", "Wakeup", "Comments"]}
                                index={-1}
                                items={registrations}
                                striped
                                title={heading}
                            />
                        </Row>

                    </>

                )}

            </Container>

        </>

    )

}

export default GuestHistoryReport;
