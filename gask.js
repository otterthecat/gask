#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;

// list of node modules to ignore when extracting from
// any required gulp tasks
var blacklist = {
	'fs': true,
	'gulp': true
}

// location of all available gulp tasks
// EDIT AS REQUIRED FOR YOUR SYSTEM/SET UP
var taskPath = '/home/user/path/to/gulp/tasks/';

// arguments passed to script start at (zero indexed) 2nd key
// if no args passed, default to Browserify
var args = process.argv.slice(2);
var files = args.length > 0 ? args : ['browserify'];

// array to contain all required dev dependencies
var taskList = [];

// patterns to extract module names to be added to package.json
var regexReq = /require\((\'|\")[a-zA-Z-_]+/g
var regexMod = /require\((\'|\")/

// function to remove any duplicates from an array of strings
var flatten = function(arry){
	var obj = {};
	return arry.filter(function(item){
		if(!obj.hasOwnProperty(item) && !blacklist.hasOwnProperty(item)){
			obj[item] = true;
			return item;
		}
	});
};

// copy files & update taskList
files.forEach(function(item){
	var content = fs.readFileSync(taskPath + item + '.js', 'utf8');
	// todo - check if /gulp/tasks/ directories exist
	// if not, create them
	fs.writeFileSync(process.cwd() + '/gulp/tasks/' + item + '.js', content, 'utf8');
	taskList = taskList.concat(content.match(regexReq).map(function(item){
		return item.replace(regexMod, '');
	}));
});

console.log('please wait while I install dev dependencies (I may need your password for this)');

// update package.json and install dev dependencies.
// Notify user of success/fail
exec('sudo npm install ' + flatten(taskList).join(' ') + ' --save-dev', function(err, stdout, stderr){
	if(err !== null){
		console.log('Dammit! This just happened:\n', err);
		console.log(stderr);
		return false;
	}

	console.log('Gulp tasks added and package.json updated! Good for you!');
});
