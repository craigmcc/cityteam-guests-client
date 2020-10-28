// IMPLEMENTATION NOTE:  The "options" we are parsing come from code inside
// this application, not from external clients (like the server side deals with),
// so we do not need to sanitize for malicious input.

const queryParameters = (options) => {

    if (!options) {
        return "";
    }
    let result = "";
    for (let [key, value] of Object.entries(options)) {
        if (result.length === 0) {
            result += "?";
        } else {
            result += "&";
        }
        if (value === "") {
            result += key;
        } else {
            result += key + "=" + value;
        }
    }
    return result;
}

export default queryParameters;
