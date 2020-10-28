import http from "../http-common";
import queryParameters from "../util/query.parameters";

let GUESTS_BASE = "/guests";

// Standard CRUD Endpoints ---------------------------------------------------

export const all = (options) => {
    return http.get(GUESTS_BASE + `${queryParameters(options)}`);
}

export const find = (guestId, options) => {
    return http.get(GUESTS_BASE + `/${guestId}${queryParameters(options)}`);
}

export const insert = guest => {
    return http.post(GUESTS_BASE, guest);
}

export const remove = guestId => {
    return http.delete(GUESTS_BASE + `/${guestId}`);
}

export const update = (guestId, guest) => {
    return http.put(GUESTS_BASE + `/${guestId}`, guest);
}

// Model Specific Endpoints --------------------------------------------------

// ***** Guest-Registration Relationships *****

export const registrationAll = (guestId, options) => {
    return http.get(GUESTS_BASE +
        `/${guestId}/registrations${queryParameters(options)}`);
}

