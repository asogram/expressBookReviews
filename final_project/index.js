const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let users = require("./router/auth_users.js").users;
const app = express();
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, (err, payload) => {
            if (err) next();
            else if (payload) {
                for (let user of users) {
                    if (user.id === payload.id) {
                        req.user = user;
                        next();
                    }
                }
                if (!req.user) next();
            }
        }
        );
    }
    next();
});

const PORT = 5500;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
