import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import * as GuestClient from "../clients/GuestClient";
import { FacilityContext } from "../contexts/FacilityContext";
import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import Pagination from "../library/components/Pagination";
import SearchBar from "../library/components/SearchBar";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";


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
    const [pageSize] = useState(10);
    const [registrations, setRegistrations] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.info("GuestHistoryReport.useEffect()");
        retrieveAllGuests();
        setIndex(-1);
        setSearchText("")
    }, [facilityContext.selectedFacility]);


    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("GuestHistoryReport.handleIndex(-1)");
            setGuest(null);
            setIndex(-1);
        } else {
            console.info("GuestHistoryReport.handleIndex("
                + newIndex + ", "
                + JSON.stringify(guests[newIndex], Replacers.GUEST)
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

    const onChange = (event) => {
        console.info("GuestHistoryReport.onChange("
            + event.target.value
            + ")");
        setCurrentPage(1);
        setSearchText(event.target.value);
        retrieveGuests(event.target.value, currentPage);
    }

    const onClick = () => {
        console.info("GuestHistoryReport.onClick("
            + searchText
            + ")");
        retrieveGuests(searchText, currentPage);
    }

    const onNext = () => {
        console.info("GuestHistoryReport.onNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onPrevious = () => {
        console.info("GuestHistoryReport.onPrevious()");
        let newCurrentPage = currentPage - 1;
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
        }
    }

    const retrieveMatchingGuests = (newSearchText, newCurrentPage) => {
        console.info("GuestHistoryReport.retrieveMatchingGuests for("
            + JSON.stringify(facilityContext.selectedFacility,Replacers.FACILITY)
            + ", searchText=" + newSearchText
            + ", currentPage=" + newCurrentPage
            + ")");
        FacilityClient.guestName(facilityContext.selectedFacility.id, newSearchText,
                {
                    limit: pageSize,
                    offset: (pageSize * (newCurrentPage - 1))
                })
            .then(response => {
                console.info("GuestHistoryReport.retrieveMatchingGuests got("
                    + JSON.stringify(response.data,Replacers.GUEST)
                    + ")");
                setGuests(response.data);
                setIndex(-1);
            })
            .catch(error => {
                reportError("GuestHistoryReport.retrieveMatchingGuests()", error);
            });
    }

    const retrieveRegistrations = (newGuest) => {
        console.info("GuestHistoryReport.retrieveRegistrations for("
            + JSON.stringify(newGuest, Replacers.GUEST)
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
                    JSON.stringify(response.data, Replacers.REGISTRATION));
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
                                <strong>Guest History for&nbsp;
                                    {facilityContext.selectedFacility.name}
                                </strong>
                            </Col>
                            <Col className="col-8">
                                <SearchBar
                                    fieldName="searchByName"
                                    fieldValue={searchText}
                                    onChange={onChange}
                                    onClick={onClick}
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
