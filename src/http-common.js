import axios from "axios";

export default axios.create({
    baseURL: baseURL(),
    headers: {
        "Content-Type" : "application/json"
    },
});

function baseURL() {
    console.log(`Node Environment is:   '${process.env.NODE_ENV}'`);
    let serverURI = process.env.REACT_APP_SERVER_URI;
    console.log(`Backend Server URI is: '${serverURI}'`);
    return serverURI ? serverURI : "http://localhost:8082/api";
}
