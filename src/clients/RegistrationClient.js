import http from "../http-common";
import queryParameters from "../util/query.parameters";

let REGISTRATIONS_BASE = "/registrations";

// Standard CRUD Endpoints ---------------------------------------------------

export const all = (options) => {
    return http.get(REGISTRATIONS_BASE + `${queryParameters(options)}`);
}

export const find = (registrationId, options) => {
    return http.get(REGISTRATIONS_BASE + `/${registrationId}${queryParameters(options)}`);
}

export const insert = registration => {
    return http.post(REGISTRATIONS_BASE, registration);
}

export const remove = registrationId => {
    return http.delete(REGISTRATIONS_BASE + `/${registrationId}`);
}

export const update = (registrationId, registration) => {
    return http.put(REGISTRATIONS_BASE + `/${registrationId}`, registration);
}

// Model Specific Endpoints --------------------------------------------------

export const assign = (registrationId, assign) => {
    return http.post(REGISTRATIONS_BASE + `/${registrationId}/assign`, assign);
}

export const deassign = (registrationId) => {
    return http.post(REGISTRATIONS_BASE + `/${registrationId}/deassign`);
}

export const reassign = (registrationIdFrom, registrationIdTo) => {
    return http.post(REGISTRATIONS_BASE +
        `/${registrationIdFrom}/reassign/${registrationIdTo}`);
}
