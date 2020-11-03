import React, { useState } from "react";
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
import * as Validations from "../library/util/Validations";

import * as FacilityClient from "../clients/FacilityClient";
import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";

// FacilityForm --------------------------------------------------------------

// Input form for editing Facility contents (with Formik-based validations).

// NOTES:
// - handleInsert or handleUpdate will only be called when all
//   validations pass.
// - Parent component can abandon a form with no complications.

// Incoming Properties -------------------------------------------------------

// autoFocus                Should first element receive autoFocus? [false]
// facility                 Facility containing initial values,
//                          id<0 for adding [*REQUIRED*]
// handleInsert             Handle (facility) insert request [no handler]
// handleRemote             Handle (facility) remove request [no handler]
// handleUpdate             Handle (facility) update request [no handler]
// onConfirmNegative        Handle () on negative confirmation [no handler]

// Component Details ---------------------------------------------------------

const FacilityForm = (props) => {

    const [adding] = useState(props.facility.id < 0);
    const [initialValues] = useState(Transformations.toEmptyStrings(props.facility));
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInsert = (values) => {
        console.info("FacilityForm.handleInsert("
            + JSON.stringify(values, Replacers.FACILITY)
            + ")");
        if (props.handleInsert) {
            props.handleInsert(Transformations.toNullValues(values));
        } else {
            alert("FacilityForm: Programming error, no handleInsert defined,"
                + "so no insert is possible.");
        }
    }

    const handleRemove = (values) => {
        console.info("FacilityForm.handleRemove("
            + JSON.stringify(values, Replacers.FACILITY)
            + ")");
        if (props.handleRemove) {
            props.handleRemove(initialValues);
        } else {
            alert("FacilityForm: Programming error, no handleRemove defined,"
                + "so no remove is possible.");
        }
    }

    const handleSubmit = (values, actions) => {
        console.info("FacilityForm.handleSubmit("
            + JSON.stringify(values, Replacers.FACILITY)
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
        console.info("FacilityForm.handleUpdate("
            + JSON.stringify(values, Replacers.FACILITY)
            + ")");
        if (props.handleUpdate) {
            props.handleUpdate(Transformations.toNullValues(values));
        } else {
            alert("FacilityForm: Programming error, no handleUpdate defined,"
                + "so no update is possible.");
        }
    }

    const onConfirm = () => {
        console.info("FacilityFormOld.onConfirm()");
        setShowConfirm(true);
    }

    const onConfirmNegative = () => {
        console.info("FacilityFormOld.onConfirmNegative()");
        setShowConfirm(false);
        if (props.onConfirmNegative) {
            props.onConfirmNegative();
        }
    }

    const onConfirmPositive = () => {
        console.info("FacilityFormOld.onConfirmPositive()");
        setShowConfirm(false);
        handleRemove();
    }

    const validateUniqueName = (value, id) => {
        return new Promise((resolve) => {
            FacilityClient.exact(value)
                .then(response => {
                    // Exists, but OK if it is this item
                    resolve(id === response.data.id);
                })
                .catch(() => {
                    // Does not exist, so definitely unique
                    resolve(true);
                })
        })
    }

    const validationSchema = () => {
        return Yup.object().shape({
            name: Yup.string()
                .required("Name is required")
                .test("unique-name",
                    "That name is already in use",
                    (value) => validateUniqueName(value, props.facility.id)),
            address1: Yup.string(),
            address2: Yup.string(),
            city: Yup.string(),
            state: Yup.string()
                .test("valid-state", "Invalid state abbreviation",
                    (value) => Validations.validateState(value)),
            zipCode: Yup.string()
                .test("valid-zip-code",
                    "Invalid zip code format, must be 99999 or 99999-9999",
                    (value) => Validations.validateZipCode(value)),
            email: Yup.string()
                .email("Invalid email address format"),
            phone: Yup.string()
                .test("valid-phone",
                    "Invalid phone number format, must be 999-999-9999",
                    (value) => Validations.validatePhone(value))
        })
    }

    return (

        <>

            {/* Details Form */}
            <Container fluid id="FacilityForm">

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
                                fieldClassName="col-10"
                                fieldName="name"
                                fieldValue={values.name}
                                label="Name:"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.name}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.name}
                            />

                            <CheckboxElement
                                fieldClassName="col-10"
                                fieldName="active"
                                fieldValue={values.active}
                                label="Active?"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.active}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.active}
                            />

                            <TextElement
                                fieldClassName="col-10"
                                fieldName="address1"
                                fieldValue={values.address1}
                                label="Address 1:"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.address1}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.address1}
                            />

                            <TextElement
                                fieldClassName="col-10"
                                fieldName="address2"
                                fieldValue={values.address2}
                                label="Address 2:"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.address2}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.address2}
                            />

                            <Row>
                                <Col className="col-6">
                                    <TextElement
                                        fieldClassName="col-8"
                                        fieldName="city"
                                        fieldValue={values.city}
                                        label="City:"
                                        labelClassName="col-4"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col className="col-3">
                                    <TextElement
                                        fieldClassName="col-8"
                                        fieldName="state"
                                        fieldValue={values.state}
                                        htmlSize={2}
                                        label="State:"
                                        labelClassName="col-4"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col className="col-3">
                                    <TextElement
                                        fieldClassName="col-8"
                                        fieldName="zipCode"
                                        fieldValue={values.zipCode}
                                        htmlSize={10}
                                        label="Zip:"
                                        labelClassName="col-4"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>

                            <CommonError
                                errors={errors.city}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.city}
                            />
                            <CommonError
                                errors={errors.state}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.state}
                            />
                            <CommonError
                                errors={errors.zipCode}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.zipCode}
                            />

                            <TextElement
                                fieldClassName="col-10"
                                fieldName="email"
                                fieldValue={values.email}
                                label="Email:"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.email}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.email}
                            />

                            <TextElement
                                fieldClassName="col-10"
                                fieldName="phone"
                                fieldValue={values.phone}
                                label="Phone:"
                                labelClassName="col-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.phone}
                                fieldClassName="col-10"
                                labelClassName="col-2"
                                touched={touched.phone}
                            />

                            <Row className="mt-3">
                                <Col className="col-2"/>
                                <Col className="col-8">
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
                        Removing this Facility not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related Guest,
                            Registration, and Template information
                        </strong>.
                    </p>
                    <p>Consider marking this Facility as inactive instead.</p>
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

export default FacilityForm;
