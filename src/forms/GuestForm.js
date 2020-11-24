import React, { useContext, useState } from "react";
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
import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";

// GuestForm -----------------------------------------------------------------

// Input form for editing Guest contents (with Formik-based validations).

// NOTES:
// - handleInsert or handleUpdate will only be called when all
//   validations pass.
// - Parent component can abandon a form with no complications.

// Incoming Properties -------------------------------------------------------

// autoFocus                Should first element receive autoFocus? [false]
// handleInsert             Handle (guest) insert request [no handler]
// handleRemote             Handle (guest) remove request [no handler]
// handleUpdate             Handle (guest) update request [no handler]
// guest                    Guest containing initial values,
//                          id<0 for adding [*REQUIRED*]
// onConfirmNegative        Handle () on negative confirmation [no handler]
// saveLabel                Label for Save button [Save]
// withoutActive            Skip the active flag in the form? [false]
// withoutRemove            Skip the remove button in the form? [false]

// Component Details ---------------------------------------------------------

const GuestForm = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState(props.guest.id < 0);
    const [initialValues] = useState(Transformations.toEmptyStrings(props.guest));
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInsert = (values) => {
        console.info("GuestForm.handleInsert("
            + JSON.stringify(values, Replacers.GUEST)
            + ")");
        if (props.handleInsert) {
            props.handleInsert(Transformations.toNullValues(values));
        } else {
            alert("GuestForm: Programming error, no handleInsert defined, "
                + "so no insert is possible.");
        }
    }

    const handleRemove = (values) => {
        console.info("GuestForm.handleRemove("
            + JSON.stringify(values, Replacers.GUEST)
            + ")");
        if (props.handleRemove) {
            props.handleRemove(initialValues);
        } else {
            alert("GuestForm: Programming error, no handleRemove defined, "
                + "so no remove is possible.");
        }
    }

    const handleSubmit = (values, actions) => {
        console.info("GuestForm.handleSubmit("
            + JSON.stringify(values, Replacers.GUEST)
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
        console.info("GuestForm.handleUpdate("
            + JSON.stringify(values, Replacers.GUEST)
            + ")");
        if (props.handleUpdate) {
            props.handleUpdate(Transformations.toNullValues(values));
        } else {
            alert("GuestForm: Programming error, no handleUpdate defined, "
                + "so no update is possible.");
        }
    }

    const onConfirm = () => {
        console.info("GuestForm.onConfirm()");
        setShowConfirm(true);
    }

    const onConfirmNegative = () => {
        console.info("GuestForm.onConfirmNegative()");
        setShowConfirm(false);
        if (props.onConfirmNegative) {
            props.onConfirmNegative();
        }
    }

    const onConfirmPositive = () => {
        console.info("GuestForm.onConfirmPositive()");
        setShowConfirm(false);
        handleRemove();
    }

    const validateUniqueName = (guestId, facilityId, firstName, lastName) => {
        console.info("GuestForm.validateUniqueName("
            + ", guestId=" + guestId
            + ", facilityId=" + facilityId
            + ", firstName=" + firstName
            + ", lastName=" + lastName
            + ")");
        return new Promise((resolve) => {
            FacilityClient.guestExact(facilityId, firstName, lastName)
                .then(response => {
                    // Exists but OK if it is this item
                    resolve(guestId === response.data.id);
                })
                .catch(() => {
                    // Does not exist, so definitely unique
                    resolve(true);
                })
        })
    }

    const validationSchema = () => {
        return Yup.object().shape({
            firstName: Yup.string()
                .required("First Name is required"),
            lastName: Yup.string()
                .required("Last Name is required")
                .test("unique-name",
                    "That name is already in use within this facility",
                    function (lastName) {
                        return validateUniqueName(this.parent.id,
                            facilityContext.selectedFacility.id,
                            this.parent.firstName,
                            lastName
                        )
                    }),
            comments: Yup.string()
        });
    }


    return (

        <>

            {/* Details Form */}
            <Container fluid id="GuestForm">

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
                                fieldName="firstName"
                                fieldValue={values.firstName}
                                label="First Name:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.firstName}
                                touched={touched.firstName}
                            />

                            <TextElement
                                fieldName="lastName"
                                fieldValue={values.lastName}
                                label="Last Name:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.lastName}
                                touched={touched.lastName}
                            />

                            {(!props.withoutActive) ? (
                                <>
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
                                </>
                            ) : null }

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
                                fieldName="favorite"
                                fieldValue={values.favorite}
                                htmlSize={3}
                                label="Favorite Mat:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.favorite}
                                touched={touched.favorite}
                            />

                            <Row className="mt-3">
                                <Col className="col-3"/>
                                <Col className="col-7">
                                    <SaveButton
                                        disabled={isSubmitting || !isValid}
                                        label={props.saveLabel ? props.saveLabel : "Save"}
                                    />
                                </Col>
                                <Col className="col-2 float-right">
                                    {!props.withoutRemove ? (
                                        <RemoveButton
                                            disabled={adding}
                                            onClick={onConfirm}
                                        />
                                    ) : null }
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
                        Removing this Guest not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related
                            Registration history information
                        </strong>.
                    </p>
                    <p>Consider marking this Guest as inactive instead.</p>
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

export default GuestForm;
