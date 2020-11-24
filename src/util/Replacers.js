// Various replacers (lists of fields to include) for JSON.stringify() calls

export const FACILITY = ["id", "name"];

export const GUEST = ["id", "firstName", "lastName"];

export const REGISTRATION = ["id", "registrationDate", "matNumber", "features",
    "facilityId", "guestId", "guest.firstName", "guest.lastName"];

export const SUMMARY = ["registrationDate", "totalAssigned", "totalUnassigned", "totalAmount"];

export const TEMPLATE = ["id", "name"];

