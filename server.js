//jshint esversion:6
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Note = require("./models/note");

mongoose.connect("mongodb+srv://adminzineddine:adminpassword@cluster0.etraw.mongodb.net/myFirstDatabase",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false, 
        useCreateIndex: true
    }
);

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////  Login/Register Routes  ////////////////////////

app.post("/isAuthenticated", function(req, res){
    if(req.isAuthenticated()) return res.send({isAuthenticated: true, user: req.user});
    return res.send({isAuthenticated: false});
});

app.post("/login", function(req, res, next) {
    passport.authenticate("local", function(error, user, info) {
        if (error) return next(error); 
        if (!user) return res.send(error);
        req.logIn(user, function(error) {
            if (error) return next(error);
            return res.send("sucess");
        });
    })(req, res, next);
});

app.post("/register", function(req, res){
    User.register(
        new User({username: req.body.username, name:req.body.name}), 
        req.body.password, function(error, user){
            if(error){
                console.log(error);
                return res.send(error);
            }
            passport.authenticate("local")(req, res, function(){
                return res.send("sucess");
            });
        }
    );
});

app.post("/logout", function(req, res){ 
    req.logout();
    return res.send("Logged out");
});

/////////////////////  Create/Delete Node Routes  /////////////////////
app.post("/create-note", function(req, res){
    let newNote = new Note();
    newNote.userID = req.user._id;
    newNote.title = req.body.title;
    newNote.content = req.body.content;
    newNote.time = req.body.time;
    newNote.save(function(error, createdNote){
        if(!error){
            console.log("saved!");
            res.send({id: createdNote._id});
        } else {
            console.log(error);
        }
    });
});

app.post("/delete-note/:id", function(req, res){
    const id = req.params.id;
    Note.findOneAndRemove({_id: id}, function(error){
        if(error) console.log(error);
        console.log("deleted");
    }); 
});

app.post("/get-notes", function(req, res){
    Note.find({userID: req.user._id},
        function(error, notes) {
            if (error) return res.send(error);
            return res.send(notes);
        }
    );
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log("Server running on port " + port);