const fetch = require("node-fetch");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json())

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true,}))

// GET REQUESTS
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

// POST, DELETE, PUT REQUESTS: TO be Added (if required)
app.get('/api', (request, response) => {
    const {houseNumber} = request.query;
    let {houseNumberSuffix} = request.query;
    const {streetName} = request.query;
    const {streetType} = request.query;
    const {suburbOrPlaceOrLocality} = request.query;
    const {postCode} = request.query;
    const {stateOrTerritory} = request.query;

    if (houseNumber == null || streetName == null || streetType == null || suburbOrPlaceOrLocality == null || postCode == null || stateOrTerritory == null) {
        response.status(400).send("Missing Parameters");
        return;
    }

    if (houseNumberSuffix == null) {
        houseNumberSuffix = "";
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            "ocp-apim-subscription-key": "2e5d3f4fe62e4f5ba9ac82a8059482a6",
        },
        body: JSON.stringify({
            "address":
                {
                    "houseNumber":houseNumber,
                    "houseNumberSuffix":houseNumberSuffix,
                    "streetName":streetName,
                    "streetType":streetType,
                    "suburbOrPlaceOrLocality":suburbOrPlaceOrLocality,
                    "postCode":postCode,
                    "stateOrTerritory":stateOrTerritory
                },
            "installationType":"NEW_CONNECTION",
            "applicationType":"NEW_CONNECTION",
            "applicationSubtype":"DETACHED_RESIDENTIAL_PREMISES"
        }),
        redirect: 'follow'
    };

    fetch("https://jemena-api-gateway.azure-api.net/indicativeprice/GasIndicativeOffer", requestOptions)
        .then(response => response.text())
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json(error));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
