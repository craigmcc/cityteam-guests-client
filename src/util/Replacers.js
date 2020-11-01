// Various replacers (lists of fields to include) for JSON.stringify() calls

export const FACILITY = ["id", "name"];

export const GUEST = ["id", "firstName", "lastName"];

export const REGISTRATION = ["id", "registrationDate", "matNumberAndFeatures"];

export const SUMMARY = ["registrationDate", "totalAssigned", "totalUnassigned"];

export const TEMPLATE = ["id", "name"];

