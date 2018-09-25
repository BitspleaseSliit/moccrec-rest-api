'use strict';
var passport = require('passport');
var jwt = require('jwt-simple');
require('../config/passport')(passport);
var User = require('../models/user');
var config = require('../config/database');

var express = require('express');
var router = express.Router();


router.post('/signup', function (req, res, next) {

    if (!req.body.name || !req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please enter the required details.' });
    } else {
        // var newUser = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });

        var newUser = new User(req.body);
    }

    // save new user in database
    newUser.save(function (err) {
        if (err) {
            return res.json({ success: false, msg: 'Email already exists.' });
        } else {
            res.json({ success: true, msg: 'Successful created new user.' });
        }
    });

});

router.post('/login', function (req, res) {

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });

});

router.get('/userDetails', passport.authenticate('jwt', { session: false }), function (req, res) {

    var getToken = function (headers) {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    };


    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                var sendUser = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    type: user.type
                }
                res.json(sendUser);
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }

});


router.get('/details/:id', function (req, res) {
    const userId = req.params.id;
    User.findById(userId, function (err, user) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }
        if (!user) {
            return res.status(403).send({ success: false, msg: 'User not found.' });
        } else {
            // var sendUser = {
            //     _id : user._id,
            //     email : user.email,
            //     name : user.name,
            //     type : user.type
            // }
            user.password = "NA"
            res.json(user);
        }
    });

});

router.post('/update/:id', function (req, res, next) {

    const userId = req.params.id;
    User.findByIdAndUpdate(userId, req.body).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        console.error(err);
        res.sendStatus(500);
    });

});


router.post('/delete/:id', function (req, res, next) {

    const userId = req.params.id;
    User.findByIdAndUpdate(userId, { $push: { "status": false } }).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        console.error(err);
        res.sendStatus(500);
    });

});


module.exports = router;
