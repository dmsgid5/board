const express = require('express');

const app = express()

const commonRouter = require('./router/common')


app.use(express.json({
    limit: '300mb'
}));

app.use(express.urlencoded({
    limit: '300mb',
    parameterLimit: 100000,
    extended: true
}));


app.use('/',commonRouter)








module.exports = {
    path: '/api',
    handler: app
}