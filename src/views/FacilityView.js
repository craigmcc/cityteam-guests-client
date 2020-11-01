import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
// import FacilityForm from "../forms/FacilityForm";
import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import SearchBar from "../library/components/SearchBar";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";

// FacilityView --------------------------------------------------------------

// Top-level view for administering Facilities.

// Component Details ---------------------------------------------------------

const FacilityView = () => {

    const facilityContext = useContext(FacilityContext);

    const [facility, setFacility] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [index, setIndex] = useState(-1);
    const [searchText, setSearchText] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        console.info("FacilityView.useEffect()");
        retrieveAllFacilities();
    }, []);


    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("FacilityView.handleIndex(-1)");
            setFacility(null);
            setIndex(-1);
            setShow(false);
        } else {
            console.info("FacilityView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(facilities[newIndex], Replacers.FACILITY)
                + ")");
            setFacility(facilities[newIndex]);
            setIndex(newIndex);
            setShow(true);
        }
    }

    const handleInsert = (facility) => {
        console.info("FacilityView.handleInsert("
            + JSON.stringify(facility, Replacers.FACILITY)
            + ")");
        setShow(false);
        retrieveFacilities(searchText);
    }

    const handleRemove = (facility) => {
        console.info("FacilityView.handleRemove("
            + JSON.stringify(facility, Replacers.FACILITY)
            + ")");
        setShow(false);
        retrieveFacilities(searchText);
    }

    const handleUpdate = (facility) => {
        console.info("FacilityView.handleUpdate("
            + JSON.stringify(facility, Replacers.FACILITY)
            + ")");
        setShow(false);
        retrieveFacilities(searchText);
    }

    const onAdd = () => {
        console.info("FacilityView.onAdd()");
        setFacility(null);
        setShow(true);
    }

    const onChange = (event) => {
        console.info("FacilityView.onChange(" + event.target.value + ")");
        setSearchText(event.target.value);
        retrieveFacilities(event.target.value);
    }

    const onClick = () => {
        console.info("FacilityView.onClick()");
        retrieveFacilities(searchText);
    }

    const onHide = () => {
        console.info("FacilityView.onHide()");
        setIndex(-1);
        setShow(false);
    }

    const retrieveAllFacilities = () => {
        FacilityClient.all()
            .then(response => {
                console.info("FacilityView.retrieveAllFacilities("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                setFacilities(response.data);
                setIndex(-1);
                setSearchText("");
            })
            .catch(error => {
                reportError("FacilityView.retrieveAllFacilities()", error);
            });
        setIndex(-1);
    }

    const retrieveFacilities = (newSearchText) => {
        if (newSearchText === "") {
            retrieveAllFacilities();
        } else {
            retrieveMatchingFacilities(newSearchText);
            setIndex(-1);
        }
    }

    const retrieveMatchingFacilities = (newSearchText) => {
        FacilityClient.name(newSearchText)
            .then(response => {
                console.info("FacilityView.retrieveMatchingFacilities("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                setFacilities(response.data);
                setIndex(-1);
            })
            .catch(error => {
                reportError("FacilityView.retrieveMatchingFacilities()", error);
            });
    }

    // TODO - skip modals for now
    return (

        <>

            <Container fluid id="FacilityView">

                <Row className="mb-3">
                    <Col className="col-4">
                        <strong className="mr-3">CityTeam Facilities</strong>
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
                            placeholder="Search by all or part of Facility name ..."
                            // withAction
                        />
                    </Col>
                </Row>

                <Row className="ml-1 mr-1">
                    <List
                        bordered
                        fields={["name", "active", "city", "state",
                                 "zipCode", "phone", "email"]}
                        // footer
                        handleIndex={handleIndex}
                        headers={["Name", "Active", "City", "State",
                                  "Zip Code", "Phone Number", "Email Address"]}
                        hover
                        index={index}
                        items={facilities}
                        striped
                        title={(searchText.length > 0 ? "Matching" : "All")
                            + " CityTeam Facilities"}
                    />
                </Row>

                <Row className="mb-2 ml-1 mr-1">
                    Click &nbsp;<strong>Add</strong>&nbsp; for a new Facility, or
                    click on a row in the table to edit an existing one.
                </Row>

            </Container>

        </>

    )

}

export default FacilityView;
