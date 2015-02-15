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
var taskPath = '/home/d/projects/github/big-gulp/gulp/tasks/';

// arguments passed to script start at (zero indexed) 2nd key
// if no args passed, default to Browserify
var args = process.argv.slice(2);
var files = args.length > 0 ? args : ['browserify'];

// array to contain all required dev dependencies
var taskList = [];

var regexReq = /[^require\(\'\"][-_a-z0-9\/\.:]+(?=[\'\"]\)([a-z\.]+)*;$)/gim

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

var directoryPath = process.cwd() + '/gulp/tasks/';

var getDependencies = function(){
	// copy files & update taskList
	files.forEach(function(item){
		item = item.indexOf(':') > 0 ? item.replace(':', '-') : item;
		var content = fs.readFileSync(taskPath + item + '.js', 'utf8');
		fs.writeFileSync(directoryPath + item + '.js', content, 'utf8');
		taskList = taskList.concat(content.match(regexReq).map(function(dep){
			// only return installed modules
			if(dep.indexOf('/') < 0){
				return dep;
			}
			else {
				var include = fs.readFileSync(taskPath + dep + '.js', 'utf8');
				fs.writeFileSync(directoryPath + dep + '.js', include, 'utf8');
			}
		}));
	});
};

var installDependencies = function(){
	console.log('please wait while I install dev dependencies (I may need your password for this)');

	// update package.json and install dev dependencies.
	// Notify user of success/fail
	exec('sudo npm install ' + flatten(taskList).join(' ') + ' --save-dev', function(err, stdout, stderr){
		if(err !== null){
			console.log('Dammit! This just happened:\n', err);
			console.log(stderr);
			return false;
		}

		console.log(stdout);
		console.log('Gulp tasks added and package.json updated! Good for you!');
	});
}

var handleDependencies = function(){
	getDependencies();
	installDependencies();
}

fs.stat(directoryPath, function(err, data){
	if(err){

		if(err.code === 'ENOENT') {
			console.log('hmmm, seems you don\'t have a task directory set. I\'ll take care of it');
			exec('mkdir -p ' + directoryPath + ' && mkdir ' + directoryPath + '../config', function(err){
				if(err){
					console.log('Dammit, I failed ', err);
					return err;
				}
				console.log('Completed task directory');
				handleDependencies();
			});
		}
		else {
			console.log('Process aborted due to error ', err);
			return err;
		}
	}
	else {
		handleDependencies();
	}
});
