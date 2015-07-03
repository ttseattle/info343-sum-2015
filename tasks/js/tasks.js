"use strict";

/*
    tasks.js
    Script for the index.html page
    This code will use Parse.com's JavaScript library to create new tasks, save them, query them
    mark them as done, and purge done tasks
 */

//use jQuery to register a function that is called when the document is ready for manipulation
$(function() {
   var currentUser = Parse.User.current();
    if (!currentUser) { //if there is no current user
        window.location = 'signin.html'; //redirect user to signin page
    }

    $('.nav-link-sign-out').click(function(event) {
        event.preventDefault(); //don't want browser to treat like hyperlink
        Parse.User.logOut(); //performs logout operation and destroy current session
        window.location = 'signin.html'; //takes user back to signin page
    });

    //populate span (line 24) with username
    $('.user-name').text(currentUser.get('firstName') + " " + currentUser.get('lastName'));
    //.text will escape any HTML the user may have typed in, interpret as just a string
    //.html would interpret as actual HTML

    //create a new class, will be a function that construct instances of tasks
    var Task = Parse.Object.extend('Task');
    var tasksQuery = new Parse.Query(Task); //tells query what to use to create instances of the task when we come back
    tasksQuery.equalTo('user', currentUser); //only want tasks set by current user
    tasksQuery.ascending('done, createdAt'); //will sort tasks in this order, putting dones at bottom

    var TaskList = Parse.Collection.extend({
        model: Task,
        query: tasksQuery,
        getCompleted: function() {
            return this.filter(function(task) {
                return task.get('done'); //returns true --> this will be part of the results of this filter operation
            });
        }
    });//acts like constructor for creating new versions

    var tasks = new TaskList();
    tasks.on('all', function() { //anytime we add, remove, refresh server
        //clear out ul spinner and create li element
        var taskList = $('.task-list'); //gives us ul element
        taskList.empty();
        this.forEach(function(task) {
            var taskItem = $(document.createElement('li'));//pass me current item as parameter of function, give jquery version of li element
            taskItem.text(task.get('title'));
            if (task.get('done')) {
                taskItem.addClass('task-done');
            }
            taskItem.click(function() {
                task.set('done', !task.get('done')); //inverts property to what it is currently
                task.save(); //saves so that can still be seen after page is refreshed
            });
            taskList.append(taskItem);
        });
        if (this.getCompleted().length > 0) {
            $('.btn-purge').fadeIn(200);
        } else {
            $('.btn-purge').fadeOut(200);
        }

        $('.btn-purge').click(function() {
            Parse.Object.destroyAll(tasks.getCompleted());
        });
    });
    tasks.fetch(); //executes query to Parse and gets data back
    $('.form-new-task').submit(function(event) {
        event.preventDefault();
        var newTaskForm = $(this); //this keyword set to DOM element
        var newTitleInput = newTaskForm.find('.new-task-title');
        var newTask = new Task();
        newTask.set('title', newTitleInput.val());
        newTask.set('user', currentUser); //task is associated with currentUser and nobody else
        newTask.set('done', false); //new task, by def not done yet
        var addButton = newTaskForm.find(':submit'); //jQuery selector always for finding submit type
        addButton.prop('disabled', true).addClass('working');
        newTask.save().then(function() {
            tasks.add(newTask);
            newTitleInput.val(''); //clears
            addButton.prop('disabled', false).removeClass('working');
        }, function(err) {
            showError(err);
            addButton.prop('disabled', false).removeClass('working');
        }); //cause Parse to save into db
    });
});