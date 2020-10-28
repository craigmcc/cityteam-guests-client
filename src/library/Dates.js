import addDays from "date-fns/addDays";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

// Date Manipulation Utilities -----------------------------------------------

// All methods except dateFromObject (Date -> String) and
// dateToObject (String -> Date) accept and return strings
// in YYYY-MM-DD format.

// Date Functions ------------------------------------------------------------

// Return the specified date minus decrement days
export const decrement = (originalDate, decrement) => {
    return fromObject(subDays(toObject(originalDate), decrement));
}

// Return the date string from the specified Date object (local time)
export const fromObject = (originalObject) => {
    let temp = format(originalObject, "P");
    return temp.substr(6, 4) + "-" + temp.substr(0, 2)
        + "-" + temp.substr(3, 2);
}

// Return the specified date plus increment days
export const increment = (originalDate, increment) => {
    return fromObject(addDays(toObject(originalDate), increment));
}

// Return the current date in the local time zone
export const today = () => {
    return fromObject(new Date());
}

// Return the Date object representing the specified date
export const toObject = (originalDate) => {
    return new Date(originalDate + " 00:00:00");
}
