// queryParameters() ---------------------------------------------------------

// Parse the options passed in and assemble them into the query string portion
// of an outbound URI.  If a key has a "" value, it will be listed by itself,
// otherwise key=value will be rendered.

// WARNING:  No URI encoding is done here.

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
