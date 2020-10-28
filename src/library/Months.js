import addMonths from "date-fns/addMonths";
import endOfMonth from "date-fns/endOfMonth";
import startOfMonth from "date-fns/startOfMonth";
import subMonths from "date-fns/subMonths";

import * as Dates from "./Dates";

// Month Manipulation Utilities ----------------------------------------------

// All methods except monthFromObject (Date -> String) and
// monthToObject (String -> Date) accept and return strings
// in YYYY-MM format for months, and in YYYY-MM-DD format for dates.

// Month Functions -----------------------------------------------------------

// Return the specified month minus decrement days
export const decrement = (originalMonth, decrement) => {
    let originalDate = Dates.toObject(originalMonth + "-01");
    let updatedDate = subMonths(originalDate, decrement);
    return fromDate(Dates.fromObject(updatedDate));
}

// Return the end date for the specified month
export const endDate = (originalMonth) => {
    let date = Dates.toObject(originalMonth + "-01");
    return Dates.fromObject(endOfMonth(date));
}

// Return the month containing the specified date
export const fromDate = (originalDate) => {
    return originalDate.substr(0, 7);
}

// Return the specified month plus increment days
export const increment = (originalMonth, increment) => {
    let originalDate = Dates.toObject(originalMonth + "-01");
    let updatedDate = addMonths(originalDate, increment);
    return fromDate(Dates.fromObject(updatedDate));
}

// Return the month containing today's date
export const today = () => {
    return Dates.today().substr(0, 7);
}

// Return the start date for the specified month
export const startDate = (originalMonth) => {
    let date = Dates.toObject(originalMonth + "-01");
    return Dates.fromObject(startOfMonth(date));
}

