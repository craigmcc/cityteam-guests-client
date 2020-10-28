// reportError() -------------------------------------------------------------

// Log the specified error to the console.error log, and pop up an alert with
// the error.message string.  In both cases, prepend the specified prefix so
// that it will be clear where the error came from.

export const reportError = (prefix, error) => {
    console.error(`${prefix} Error: `, error);
    alert(`${prefix} Error: '${error.message}'`);
}
