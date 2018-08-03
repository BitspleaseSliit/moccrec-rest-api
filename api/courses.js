'use strict';

var Course = require('../models/course');
var User = require('../models/user');
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

function getCoureScore(user, course){
    let score = 0;
    if(user.learningStyles.active == 1){
        score += course.videoStyle.code;
        score += course.videoStyle.conversation;
        score += course.videoStyle.whiteboard;
    }else if(user.learningStyles.reflective == 1){
        score += course.videoStyle.code;
        score += course.videoStyle.conversation;
        score += course.videoStyle.whiteboard;
    }else if(user.learningStyles.sensing == 1){
        score += course.videoStyle.slide;
    }else if(user.learningStyles.intuitive == 1){
        score += course.videoStyle.talkingHead;
        score += course.videoStyle.conversation;
        score += course.videoStyle.animation;
    }else if(user.learningStyles.visual == 1){
        score += course.videoStyle.animation;
    }else if(user.learningStyles.verbal == 1){
        score += course.videoStyle.talkingHead;
        score += course.videoStyle.code;
        score += course.videoStyle.slide;
    }else if(user.learningStyles.sequential == 1){
        score += course.videoStyle.code;
        score += course.videoStyle.slide;
        score += course.videoStyle.whiteboard;
    }else if(user.learningStyles.global == 1){
        score += course.videoStyle.talkingHead;
        score += course.videoStyle.conversation;
        score += course.videoStyle.animation;
    }
    score = (score / 240) * 100;
    console.log(course.name , score);
    return parseInt(score, 10);
}

router.get('/user/:id', function(req, res){

    const userId = req.params.id;

    User.findById(userId, function(err, user){
        if (err){
            console.error(err);
            res.sendStatus(500);
        }
        if (!user) {
            return res.status(403).send({success: false, msg: 'User not found.'});
        } else {

            Course.find().exec().then(function(courses) {
                let count = 0;
                courses.forEach(element => {
                    courses[count].courseScore = getCoureScore(user, element); 
                    count++;
                });
                courses.sort(function(a, b){
                    return b.courseScore - a.courseScore;
                });

                res.json(courses);

            }).catch(function(err) {
                console.error(err);
                res.sendStatus(500);
            });
        }
    });
});

module.exports = router;


