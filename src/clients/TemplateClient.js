import http from "../http-common";
import queryParameters from "../util/query.parameters";

let TEMPLATES_BASE = "/templates";

// Standard CRUD Endpoints ---------------------------------------------------

export const all = (options) => {
    return http.get(TEMPLATES_BASE + `${queryParameters(options)}`);
}

export const find = (templateId, options) => {
    return http.get(TEMPLATES_BASE + `/${templateId}${queryParameters(options)}`);
}

export const insert = (template) => {
    return http.post(TEMPLATES_BASE, template);
}

export const remove = (templateId) => {
    return http.delete(TEMPLATES_BASE + `/${templateId}`);
}

export const update = (templateId, template) => {
    return http.put(TEMPLATES_BASE + `/${templateId}`, template);
}

// Model Specific Endpoints --------------------------------------------------

export const generate = (templateId, registrationDate) => {
    return http.post(TEMPLATES_BASE +
        `/${templateId}/generate/${registrationDate}`);
}
