import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import List from "../library/components/List";
import SearchBar from "../library/components/SearchBar";
import { FacilityContext } from "../contexts/FacilityContext";
// import GuestForm from "../forms/GuestForm";
import ActionButton from "../library/components/ActionButton";
import { reportError } from "../util/error.handling";

// GuestView -----------------------------------------------------------------

// Top-level view for administering Guests.

// TODO - reset current page when appropriate

// Component Details ---------------------------------------------------------

const GuestView = () => {

    const facilityContext = useContext(FacilityContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [index, setIndex] = useState(-1);
    const [guest, setGuest] = useState(null);
    const [guests, setGuests] = useState([]);
    const [pageSize] = useState(15);
    const [searchText, setSearchText] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        console.info("TemplateView.useEffect()");
        retrieveAllGuests();
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
                + newIndex
                + ")");
            setIndex(newIndex);
            setShow(true);
            setGuest(guests[newIndex]);
        }
    }

    const handleInsert = (guest) => {
        console.info("GuestView.handleInsert("
            + JSON.stringify(guest, ["id", "name"])
            + ")");
        setShow(false);
        retrieveGuests(searchText);
    }

    const handleRemove = (guest) => {
        console.info("GuestView.handleRemove("
            + JSON.stringify(guest, ["id", "name"])
            + ")");
        setShow(false);
        retrieveGuests(searchText);
    }

    const handleUpdate = (guest) => {
        console.info("GuestView.handleUpdate("
            + JSON.stringify(guest, ["id", "name"])
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
        console.info("FacilityView.onClick()");
        retrieveGuests(searchText, currentPage);
    }

    const onHide = () => {
        console.info("FacilityView.onHide()");
        setIndex(-1);
        setShow(false);
    }

    const onPrevious = () => {
        console.info("GuestView.onNext()");
        let newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
        retrieveGuests(searchText, newCurrentPage);
    }

    const onNext = () => {
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
            retrieveMatchingGuests(newSearchText);
            setIndex(-1);
        }
    }

    const retrieveMatchingGuests = (newSearchText, newCurrentPage) => {
        // TODO - pagination support
        FacilityClient.name(newSearchText)
            .then(response => {
                console.info("GuestView.retrieveMatchingGuests("
                    + JSON.stringify(response.data, ["id", "name"])
                    + ")");
                setGuests(response.data);
                setIndex(-1);
            })
            .catch(error => {
                reportError("FacilityView.retrieveMatchingFacilities()", error);
            });
    }


    return (

        <>

            <Container fluid id="GuestView">

                <div>
                    This is GuestView.
                </div>

            </Container>
        </>

    )

}

export default GuestView;
