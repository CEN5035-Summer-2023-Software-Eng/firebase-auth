require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const firebase = require('firebase/app');
require('firebase/auth');

// put your firebaseConfig as is into a file called firebaseConfig.js
// const firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: "",
//     appId: "",
//     measurementId: ""
// };

firebaseConfig = require('./firebase-key-sample')

firebase.initializeApp(firebaseConfig);

// const firebase_app = require('firebase-admin/app');
// const firebase = require('firebase-admin');
// firebase_app.initializeApp({
//     firebase: firebase_app.applicationDefault(),
// })

// will store the MongoDB database collection after it is loaded (see bottom of file)
let collection = null;

app.use((req, res, next) => {
    console.log(`\nNew request: ${req.method} ${req.path}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (!collection) {
        console.log("Database not loaded!");
        res.status(503).send({ message: "Please try again shortly" });
    } else {
        next();
    }
})

function checkAuth(req, res, next) {
    function throwAuthError(message, status = 403) {
        res.status(status).send({ message: "Auth Error: " + message });
    }
    let token = req.headers.authorization;
    if (!token) {
        return throwAuthError("Missing authorization header", 401);
    }
    firebase.auth().verifyIdToken(token)
        .then(decoded => {
            // attach auth info to request:
            req.user = decoded;

            // continue on
            next();
        })
        .catch(err => {
            console.log(err.message);
            throwAuthError("Invalid ID token", 403);
        })
}

app.use(express.static('./public'));

app.post('/recipes', checkAuth, (req, res) => {

    let recipe = {
        title: req.body.title,
        description: req.body.description,
        steps: req.body.steps,
    };

    if (!recipe.title || !recipe.description || !recipe.steps) {
        return res.status(400).send({ message: "Must supply title, description, steps" });
    }

    collection.insert(recipe)
        .then(results => {
            console.log(results);
            res.status(200).send({ message: "success" });
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({ message: err.message });
        })
})

app.get('/recipes', checkAuth, (req, res) => {
    collection.find({}).toArray()
        .then(results => {
            console.log(results);
            res.status(200).send({ message: "success", recipes: results })
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({ message: err.message })
        })
})


MongoClient.connect(`mongodb://${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/`, (err, client) => {
    if (err) {
        console.error("Unable to connect to MongoDB: ", err.message);
        throw err; // exits program - mongo error
    } else {
        let dbo = client.db(process.env.MONGODB_DATABASE);
        collection = dbo.collection(process.env.MONGODB_COLLECTION);
    }
})


app.listen(process.env.PORT, () => {
    console.log("Express App listening on port " + process.env.PORT);
})