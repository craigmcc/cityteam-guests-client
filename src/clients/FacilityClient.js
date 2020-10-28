import http from "../http-common";
import queryParameters from "../util/query.parameters";

let FACILITIES_BASE = "/facilities";

// Standard CRUD Endpoints ---------------------------------------------------

export const all = (options) => {
    return http.get(FACILITIES_BASE + queryParameters(options));
}

export const find = (facilityId, options) => {
    return http.get(FACILITIES_BASE + `/${facilityId}${queryParameters(options)}`);
}

export const insert = (facility) => {
    return http.post(FACILITIES_BASE, facility);
}

export const remove = (facilityId) => {
    return http.delete(FACILITIES_BASE + `/${facilityId}`);
}

export const update = (facilityId, facility) => {
    return http.put(FACILITIES_BASE + `/${facilityId}`, facility);
}

// Model Specific Endpoints --------------------------------------------------

// ***** Facility Lookups *****

export const active = (options) => {
    return http.get(FACILITIES_BASE + `/active${queryParameters(options)}`);
}

export const exact = (name, options) => {
    return http.get(FACILITIES_BASE +`/exact/${name}${queryParameters(options)}`);
}

export const name = (name, options) => {
    return http.get(FACILITIES_BASE + `/name/${name}${queryParameters(options)}`);
}

// ***** Facility-Guest Relationships *****

export const guestAll = (facilityId, options) => {
    return http.get(FACILITIES_BASE + `/${facilityId}/guests${queryParameters(options)}`);
}

export const guestExact = (facilityId, firstName, lastName, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/guests/exact/${firstName}/${lastName}${queryParameters(options)}`);
}

export const guestName = (facilityId, name, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/guests/name/${name}${queryParameters(options)}`);
}

// ***** Facility-Registration Relationships *****

export const registrationAll = (facilityId, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/registrations${queryParameters(options)}`);
}

export const registrationAvailable = (facilityId, registrationDate, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/registrations/${registrationDate}/available${queryParameters(options)}`);
}

export const registrationDate = (facilityId, registrationDate, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/registrations/${registrationDate}${queryParameters(options)}`);
}

export const registrationSummary = (facilityId, registrationDateFrom, registrationDateTo) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/registrations/summary/${registrationDateFrom}/${registrationDateTo}`);
}

// ***** Facility-Template Relationships *****

export const templateAll = (facilityId, options) => {
    return http.get(FACILITIES_BASE + `/${facilityId}/templates${queryParameters(options)}`);
}

export const templateExact = (facilityId, name, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/templates/exact/${name}${queryParameters(options)}`);
}

export const templateName = (facilityId, name, options) => {
    return http.get(FACILITIES_BASE +
        `/${facilityId}/templates/name/${name}${queryParameters(options)}`);
}
