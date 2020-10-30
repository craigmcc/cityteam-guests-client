import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import List from "../library/components/List";
import SearchBar from "../library/components/SearchBar";
import { FacilityContext } from "../contexts/FacilityContext";
// import FacilityForm from "../forms/FacilityForm";
import ActionButton from "../library/components/ActionButton";
import { reportError } from "../util/error.handling";

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


    const onAdd = (event) => {
        console.log("FacilityView.onAdd()");
        setFacility(null);
        setShow(true);
    }

    const onSearchChange = (event) => {
        console.log("FacilityView.onSearchChange(" + event.target.value + ")");
        setSearchText(event.target.value);
        retrieveFacilities(event.target.value);
    }

    const onSearchClick = (event) => {
        console.log("FacilityView.onSearchClick()");
        retrieveFacilities(searchText);
    }

    const handleSelectedIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("FacilityView.handleSelectedIndex(-1)");
            setFacility(null);
            setIndex(-1);
            setShow(false);
        } else {
            console.info("FacilityView.handleSelectedIndex("
                + newIndex + ", "
                + JSON.stringify(facilities[newIndex], ["id", "name"])
                + ")");
            setFacility(facilities[newIndex]);
            setIndex(newIndex);
            setShow(true);
        }
    }

    const retrieveAllFacilities = () => {
        FacilityClient.all()
            .then(response => {
                console.info("FacilityView.retrieveAllFacilities("
                    + JSON.stringify(response.data, ["id", "name"])
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
                    + JSON.stringify(response.data, ["id", "name"])
                    + ")");
                setFacilities(response.data);
            })
            .catch(error => {
                reportError("FacilityView.retrieveMatchingFacilities()", error);
            });
        setIndex(-1);
    }

    // TODO - skip modals for now
    return (

        <>

            <Container fluid id="FacilityView">

                <Row className="mb-3">
                    <Col className="col-4">
                        <strong className="mr-2">CityTeam Facilities</strong>
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
                            onChange={onSearchChange}
                            onClick={onSearchClick}
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
                        footer
                        handleIndex={handleSelectedIndex}
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

            </Container>

        </>

    )

}

export default FacilityView;
