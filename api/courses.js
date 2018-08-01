'use strict';

var Course = require('../models/course');
var config = require('../config/database');
var express = require('express');
var router = express.Router();

router.post('/save',function(req, res, next){

    var course = new Course(req.body);

    course.save().then(function(cc) {
        res.json(cc);
    }).catch(function(err){
        console.error(err);
        res.sendStatus(500);
    });

});

router.get('/all',function(req, res, next){

    Course.find().exec().then(function(courses) {
        res.json(courses);
    }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);
    });

});

module.exports = router;


