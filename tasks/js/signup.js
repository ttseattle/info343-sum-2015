"use strict";

/*
    signup.js
    Script for the signup.html page
    Handle the form submit and create a new Parse.User() for the new user account
 */

//use jQuery to register a function that is called when the document is ready for manipulation
$(function() { //will get called when DOM is ready for manipulation
    $('.form-signup').submit(function(event){
        event.preventDefault();
        //collect form values and create new user using Parse
        var user = new Parse.User();
        user.set('username', $('#inputEmail').val()); //using backbone js
        user.set('password', $('#inputPassword').val());
        user.set('firstName', $('#inputFName').val());
        user.set('lastName', $('#inputLName').val());
        //sign up this user!
        user.signUp().then(function() {
            clearError();
            window.location = 'index.html';
        }, function(err) { // each parameter is a function - first called in case of success, second in case of error
            showError(err);
        }); //creates a new user account within this application so they can keep using this Parse application
        /* alert('test'); //executes immediately, don't know if server has happened yet
        instead use a promise, like a jQuery success*/
    });
});