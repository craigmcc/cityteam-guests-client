// Transformations -----------------------------------------------------------

// Transform objects back and forth to how Formik wants fields presented

// toEmptyStrings() ----------------------------------------------------------

// Convert null field values in incoming to empty strings

export const toEmptyStrings = (incoming) => {
    let outgoing = { };
    for (const [key, value] of Object.entries(incoming)) {
        if (value !== null) {
            outgoing[key] = value;
        } else {
            outgoing[key] = "";
        }
    }
    return outgoing;
}

// toNullValues() ------------------------------------------------------------

// Convert empty string values in incoming to nulls

export const toNullValues = (incoming) => {
    let outgoing = { };
    for (const [key, value] of Object.entries(incoming)) {
        if (value === "") {
            outgoing[key] = null;
        } else {
            outgoing[key] = value;
        }
    }
    return outgoing;
}

// withFlattenedObject -------------------------------------------------------

// For each incoming item, copy it's fields to outgoing.  In addition, if the
// item has a field with key {name}, assume it is an object and add
// {name}.{subName} fields to the outgoing item for each field in the
// named object.  NOTE:  This only goes one level deep.

export const withFlattenedObject = (incoming, name) => {
    let outgoing = { };
    for (const [key, value] of Object.entries(incoming)) {
        outgoing[key] = value;
        if ((key === name) && (value)) {
            for (let subName in value) {
                outgoing[name + "." + subName] = value[subName];
            }
        }
    }
    return outgoing;
}

// withFlattenedObjects ------------------------------------------------------

// Call withFlattenedObject for each item in incoming array, and return the
// resulting outgoing array

export const withFlattenedObjects = (incoming, name) => {
    if (incoming.length === 0) {
        return [];
    }
    let outgoing = [];
    for (let index = 0; index < incoming.length; index++) {
        outgoing.push(withFlattenedObject(incoming[index], name));
    }
    return outgoing;
}
