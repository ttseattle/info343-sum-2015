"use strict";

/*
    signin.js
    Script for the signin.html page
    Handle the form submit and use Parse.User.logIn() to start an authenticated session
*/

//use jQuery to register a function that is called when the document is ready for manipulation
$(function() {
    $('.form-signin').submit(function(event) {
        event.preventDefault();
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        Parse.User.logIn(email, password).then(function() {
            window.location = 'index.html';
        }, function(err) {
            showError(err);
        }); //causes user session to start ith the Parse application
        // ^ asynchronous class
    });
});