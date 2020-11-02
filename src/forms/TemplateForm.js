import React, { useContext, /* useEffect, */ useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

import ActionButton from "../library/components/ActionButton";
import CheckboxElement from "../library/components/CheckboxElement";
import RemoveButton from "../library/components/RemoveButton";
import ResetButton from "../library/components/ResetButton";
import SaveButton from "../library/components/SaveButton";
import TextElement from "../library/components/TextElement";

import * as FacilityClient from "../clients/FacilityClient";
// import * as TemplateClient from "../clients/TemplateClient";
import { FacilityContext } from "../contexts/FacilityContext";
import MatsList from "../util/mats.list";
import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";
// import {reportError} from "../util/error.handling";

// TemplateForm --------------------------------------------------------------

// Input form for editing Template contents.

// NOTES:
// - handleInsert or handleUpdate will only be called when all
//   validations pass.
// - Parent component can abandon a form with no complications.

// TODO - Initial version only based on elements, not Formik.

// Incoming Properties -------------------------------------------------------

// autoFocus                Should first element receive autoFocus? [false]
// handleInsert             Handle (template) insert request [no handler]
// handleRemote             Handle (template) remove request [no handler]
// handleUpdate             Handle (template) update request [no handler]
// template                 Template containing initial values,
//                          id<0 for adding [*REQUIRED*]

// Component Details ---------------------------------------------------------

const TemplateForm = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState(props.template.id < 0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [template] = useState(props.template);
    const [values, setValues] = useState(Transformations.toEmptyStrings(props.template));

/*
    useEffect(() => {
        console.info("TemplateForm.adding:                  ", adding);
        console.info("TemplateForm.useEffect initialValues: ", initialValues);
        console.info("TemplateForm.useEffect template:      ", template);
    })
*/

    const handleInsert = (values) => {
        console.info("TemplateForm.handleInsert("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleInsert) {
            props.handleInsert(Transformations.toNullValues(values));
        }
    }

    const handleRemove = (values) => {
        console.info("TemplateForm.handleRemove("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleRemove) {
            props.handleRemove(Transformations.toNullValues(values));
        }
    }

    const handleSubmit = (values, actions) => {
        console.info("TemplateForm.handleSubmit("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        actions.setSubmitting(true);
        if (adding) {
            if (props.handleInsert) {
                props.handleInsert(values);
            }
        } else {
            if (props.handleUpdate) {
                props.handleUpdate(values);
            }
        }
        actions.setSubmitting(false);
    }

    const handleUpdate = (values) => {
        console.info("TemplateForm.handleUpdate("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleUpdate) {
            props.handleUpdate(Transformations.toNullValues(values));
        }
    }

    // Dummy until replaced by Formik (which will deal with value updates itself)
    // (((Does not seem to work on booleans, but that's ok for now)))
    const onChange = (event)  => {
        console.info("TemplateForm.onChange(" + event.target.value + ")", event);
//        console.info("  Setting field '" + event.target.name + "' to '" + event.target.value + "'");
        let updatedValues = {
            ...values
        }
        updatedValues[event.target.name] = event.target.value;
        setValues(updatedValues);
    }

    const onConfirm = () => {
        console.info("TemplateForm.onConfirm()");
        setShowConfirm(true);
    }

    const onConfirmNegative = () => {
        console.info("TemplateForm.onConfirmNegative()");
        setShowConfirm(false);
    }

    const onConfirmPositive = () => {
        console.info("TemplateForm.onConfirmPositive()");
        setShowConfirm(false);
        handleRemove();
    }

    const validateMatsList = (value) => {
        if (!value || (value.length === 0)) {
            return true;
        }
        try {
            new MatsList(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    const validateMatsSubset = (value, allMats) => {
        // value is not required (use required() ahead of this
        // in the chain if it is)
        if (!value || (value.length === 0)) {
            return true;
        }
        // allMats must already have a value
        if (!allMats || (allMats.length === 0)) {
            return false;
        }
        let allMatsObject;
        try {
            allMatsObject = new MatsList(allMats);
        } catch {
            // allMats is not valid, so we cannot be a subset
            return false;
        }
        let thisMatsObject;
        try {
            thisMatsObject = new MatsList(value);
            return thisMatsObject.isSubsetOf(allMatsObject);
        } catch {
            // This value is not valid, so it cannot be a subset
            return false;
        }
    }

    const validateUniqueName = (value, facilityId, id) => {
        return new Promise((resolve) => {
            FacilityClient.templateExact(facilityId, value)
                .then(response => {
                    // Exists but OK if it is this item
                    resolve(id === response.data.id);
                })
                .catch(() => {
                    // Does not exist, so definitely unique
                    resolve(true);
                })
        })
    }

    const validationSchema = Yup.object().shape({
            name: Yup.string()
                .required("Name is required")
                .test("unique-name",
                    "That name is already in use within this facility",
                    (value) => validateUniqueName(value,
                        facilityContext.selectedFacility.id,
                        template.id)),
            comments: Yup.string(),
            allMats: Yup.string()
                .required("All Mats list is required")
                .test("valid-all-mats",
                    "Invalid All Mats list format",
                    (value) => validateMatsList(value)),
            handicapMats: Yup.string()
                .test("valid-handicap-mats",
                    "Invalid Handicap Mats list format",
                    (value) => validateMatsList(value))
                .test("handicap-mats-subset",
                    "Handicap Mats must be a subset of All Mats",
                    function (value) {
                        return validateMatsSubset(value, this.parent.allMats);
                    }),
            socketMats: Yup.string()
                .test("valid-socket-mats",
                    "Invalid Socket Mats list format",
                    (value) => validateMatsList(value))
                .test("socket-mats-subset",
                    "Socket Mats must be a subset of All Mats",
                    function (value) {
                        return validateMatsSubset(value, this.parent.allMats);
                    }),
        });

    // TODO - Repackage as Formik based when ready
    return (

        <>

            {/* Details Form */}
            <Container fluid id="TemplateForm">

                <TextElement
                    autoFocus={props.autoFocus ? props.autoFocus : false}
                    fieldName="name"
                    fieldValue={values.name}
                    label="Name:"
                    onChange={onChange}
                />
                <CheckboxElement
                    fieldName="active"
                    fieldValue={values.active}
                    label="Active?"
                    onChange={onChange}
                />
                <TextElement
                    fieldName="comments"
                    fieldValue={values.comments}
                    label="Comments:"
                    onChange={onChange}
                />
                <TextElement
                    fieldName="allMats"
                    fieldValue={values.allMats}
                    label="All Mats:"
                    onChange={onChange}
                />
                <TextElement
                    fieldName="handicapMats"
                    fieldValue={values.handicapMats}
                    label="Handicap Mats:"
                    onChange={onChange}
                />
                <TextElement
                    fieldName="socketMats"
                    fieldValue={values.socketMats}
                    label="Socket Mats:"
                    onChange={onChange}
                />

                <Row className="mt-3">
                    <Col className="col-3"/>
                    <Col className="col-7">
                        <SaveButton/>
                        <span>&nbsp;&nbsp;</span>
                        <ResetButton/>
                    </Col>
                    <Col className="col-2 float-right">
                        <RemoveButton
                            disabled={adding}
                            onClick={onConfirm}
                        />
                    </Col>
                </Row>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this Template not reversible, and will
                        eliminate the possibility of using it for setting up
                        future date registrations.
                    </p>
                    <p>Consider marking this Template as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <ActionButton
                        label="Remove"
                        onClick={onConfirmPositive}
                        variant="danger"
                    />
                    <ActionButton
                        label="Cancel"
                        onClick={onConfirmNegative}
                        variant="primary"
                    />
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default TemplateForm;
