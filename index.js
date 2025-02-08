require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get Token from config file.d
const HUBSPOT_ACCESS_KEY = process.env.HUBSPOT_ACCESS_KEY;

// HOMEPAGE - List Cars.
app.get('/', async (req, res) => {
    const cars = 'https://api.hubapi.com/crm/v3/objects/cars?properties=car_name,car_year,car_type';
    const headers = {
        Authorization: `Bearer ${HUBSPOT_ACCESS_KEY}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('cars', { title: 'Cars Custom Object | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

//  Create a new app.get route for the form to create or update cars custom object data. Send this data along in the next route.
app.get('/update-cobj', (req, res) => {
    res.render('create', { title: 'Create Car' });
});

app.get('/update-cobj', async (req, res) => {
    try {
        res.render('create', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

app.post('/update-cobj', async (req, res) => {
    const data = {
        properties: {
            "car_name": req.body.car_name,
            "car_year": req.body.car_year,
            "car_type": req.body.car_type
        }
    }
    const createCar = `https://api.hubapi.com/crm/v3/objects/cars`;
    const headers = {
        Authorization: `Bearer ${HUBSPOT_ACCESS_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createCar, data, { headers } );
        console.log("New car created successfully");
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));