import React, { useContext, /* useEffect, */ useState } from "react";
import { Formik } from "formik";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

import ActionButton from "../library/components/ActionButton";
import CheckboxElement from "../library/components/CheckboxElement";
import CommonError from "../library/components/CommonError";
import RemoveButton from "../library/components/RemoveButton";
import SaveButton from "../library/components/SaveButton";
import TextElement from "../library/components/TextElement";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import MatsList from "../util/mats.list";
import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";

// TemplateForm --------------------------------------------------------------

// Input form for editing Template contents (with Formik-based validations).

// NOTES:
// - handleInsert or handleUpdate will only be called when all
//   validations pass.
// - Parent component can abandon a form with no complications.

// Incoming Properties -------------------------------------------------------

// autoFocus                Should first element receive autoFocus? [false]
// handleInsert             Handle (template) insert request [no handler]
// handleRemote             Handle (template) remove request [no handler]
// handleUpdate             Handle (template) update request [no handler]
// onConfirmNegative        Handle () on negative confirmation [no handler]
// template                 Template containing initial values,
//                          id<0 for adding [*REQUIRED*]

// Component Details ---------------------------------------------------------

const TemplateForm = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState(props.template.id < 0);
    const [initialValues] = useState(Transformations.toEmptyStrings(props.template));
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInsert = (values) => {
        console.info("TemplateForm.handleInsert("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleInsert) {
            props.handleInsert(Transformations.toNullValues(values));
        } else {
            alert("TemplateForm: Programming error, no handleInsert defined, "
                + "so no insert is possible.");
        }
    }

    const handleRemove = (values) => {
        console.info("TemplateForm.handleRemove("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleRemove) {
            props.handleRemove(initialValues);
        } else {
            alert("TemplateForm: Programming error, no handleRemove defined, "
                + "so no remove is possible.");
        }
    }

    const handleSubmit = (values, actions) => {
        console.info("TemplateForm.handleSubmit("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        actions.setSubmitting(true);
        if (adding) {
            handleInsert(values);
        } else {
            handleUpdate(values);
        }
        actions.setSubmitting(false);
    }

    const handleUpdate = (values) => {
        console.info("TemplateForm.handleUpdate("
            + JSON.stringify(values, Replacers.TEMPLATE)
            + ")");
        if (props.handleUpdate) {
            props.handleUpdate(Transformations.toNullValues(values));
        } else {
            alert("TemplateForm: Programming error, no handleUpdate defined, "
                + "so no update is possible.");
        }
    }

    const onConfirm = () => {
        console.info("TemplateForm.onConfirm()");
        setShowConfirm(true);
    }

    const onConfirmNegative = () => {
        console.info("TemplateForm.onConfirmNegative()");
        setShowConfirm(false);
        if (props.onConfirmNegative) {
            props.onConfirmNegative();
        }
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

    const validateUniqueName = (value, facilityId, templateId) => {
        return new Promise((resolve) => {
            FacilityClient.templateExact(
                facilityId,
                value
            )
                .then(response => {
                    // Exists but OK if it is this template
                    resolve(templateId === response.data.id);
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
                    props.template.id)),
        comments: Yup.string(),
        allMats: Yup.string()
            .required("All Mats list is required")
            .test("all-mats-valid",
                "Invalid All Mats list format",
                (value) => validateMatsList(value)),
        handicapMats: Yup.string()
            .test("handicap-mats-valid",
                "Invalid Handicap Mats list format",
                (value) => validateMatsList(value))
            .test("handicap-mats-subset",
                "Handicap Mats must be a subset of All Mats",
                function (value) {
                    return validateMatsSubset(value, this.parent.allMats);
                }),
        socketMats: Yup.string()
            .test("socket-mats-valid",
                "Invalid Socket Mats list format",
                (value) => validateMatsList(value))
            .test("socket-mats-subset",
                "Socket Mats must be a subset of All Mats",
                function (value) {
                    return validateMatsSubset(value, this.parent.allMats);
                }),
    });

    return (

        <>

            {/* Details Form */}
            <Container fluid id="TemplateForm">

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
                    }}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >
                    {( {
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        isValid,
                        touched,
                        values,
                    }) => (
                        <Form
                            className="mx-auto"
                            noValidate
                            onSubmit={handleSubmit}
                            validated={false}
                        >

                            <TextElement
                                autoFocus={props.autoFocus}
                                fieldName="name"
                                fieldValue={values.name}
                                label="Name:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.name}
                                touched={touched.name}
                            />

                            <CheckboxElement
                                fieldName="active"
                                fieldValue={values.active}
                                label="Active?"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.active}
                                touched={touched.active}
                            />

                            <TextElement
                                fieldName="comments"
                                fieldValue={values.comments}
                                label="Comments:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.comments}
                                touched={touched.comments}
                            />

                            <TextElement
                                fieldName="allMats"
                                fieldValue={values.allMats}
                                label="All Mats:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.allMats}
                                touched={touched.allMats}
                            />

                            <TextElement
                                fieldName="handicapMats"
                                fieldValue={values.handicapMats}
                                label="HandicapMats:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.handicapMats}
                                touched={touched.handicapMats}
                            />

                            <TextElement
                                fieldName="socketMats"
                                fieldValue={values.socketMats}
                                label="SocketMats:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.socketMats}
                                touched={touched.socketMats}
                            />

                            <Row className="mt-3">
                                <Col className="col-3"/>
                                <Col className="col-7">
                                    <SaveButton
                                        disabled={isSubmitting || !isValid}/>
                                </Col>
                                <Col className="col-2 float-right">
                                    <RemoveButton
                                        disabled={adding}
                                        onClick={onConfirm}
                                    />
                                </Col>
                            </Row>

                        </Form>
                    )}
                </Formik>

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
