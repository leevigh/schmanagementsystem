const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');
const randomString = require('randomstring');


module.exports = (passport) => {

    //serialize user for session
    passport.serializeUser(function(student, done){
        done(null, student.id);
    });

    //deserialize the user
    passport.deserializeUser(function(id, done){
        Student.findById(id, function(err, student){
            done(err, student);
        })
    });

    //Local Student Signup accessible only by admin
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'stuId',
        passwordField: 'password',
        passReqToCallback: true //passes entire request to callback
    },
    function(req, stuId, password, done){
        process.nextTick(function(){
            Student.findOne({'local.username': stuId}, function(err, student){
                if(err) return done(err);

                //check if student with stuId exists
                if(student){
                    return done(null, false, req.flash('signupMessage', 'This student id already exists'));
                }else{
                    //if no student with the id, create the student
                    const newStudent = new Student();

                    //set student's local credentials
                    newStudent.local.stuId = stuId;
                    newStudent.local.password = newStudent.generateHash(password);

                    //save the student
                    newStudent.save(function(err){
                        if(err) throw err;

                        return done(null, newStudent);
                    })
                    
                }
            });
        });
    }
    ))

    //Local Student Login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'stuId',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, stuId, password, done){
        Student.findOne({'local.username': stuId}, function(err, user){
            if(err) return done(err);

            //if no student found, return message
            if(!student){
                return done(null, false, req.flash('loginMessage', 'No student found'));
            }

            //if student is found but with a wrong password
            if(!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'wrong password, try again'));
            }

            //requirements satisfied, return successful
            return done(null, student);
        })
    }
    ))
}