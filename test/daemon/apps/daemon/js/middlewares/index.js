'use strict';

let express = require('express');

let jsonBlob = {
    callbacks: [express.json({limit: '10b'})]
};

module.exports = {
    expressJson: jsonBlob
}