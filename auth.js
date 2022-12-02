'use strict';


const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client  = jwksClient({
    jwksUri: process.env.JWKS_URI
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

function verifyUser(req, errorFirstOrUserCallbackFunction) {
    
    try {
        const token  = req.headers.authorization.split(' ')[1];
        jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction)
    } catch(error) {
        errorFirstOrUserCallbackFunction('Not Authorized');
    }
}

module.exports = verifyUser;

// var axios = require("axios").default;

// var options = {
//   method: 'PUT',
//   url: 'https://YOUR_DOMAIN/api/v2/prompts/login/custom-text/en',
//   headers: {
//     'content-type': 'application/json',
//     authorization: 'Bearer MGMT_API_ACCESS_TOKEN'
//   },
//   data: {login: {description: 'Login to My Virtual Trader Website'}}
// };

// axios.request(options).then(function (response) {
//   console.log(response.data);
// }).catch(function (error) {
//   console.error(error);
// });