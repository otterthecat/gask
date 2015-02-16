#!/usr/bin/env node

var readline = require('readline');
var fs = require('fs');

var pkg = {
	"name": '',
	"title": '',
	"description": '',
	"version": "0.1.0",
	"author": {
		"name": '',
		"email": ''
	},
	"repository": {
		"type": "git",
		"url": ""
	}
};

var rl = readline.createInterface(process.stdin, process.stdout);
var queue = [];

var askNextQuestion = function(){
	if(queue.length > 0){
		item = queue.shift();
		rl.question(item.query, function(data){
			item.callback(data);
			askNextQuestion();
		});
	}
	else {
		fs.writeFileSync(process.cwd() + '/package.json', JSON.stringify(pkg), 'utf8');
		return rl.close();
	}
};

var addQuestion = function(q, c){
	queue.push({
		query: q,
		callback: c
	});
};

addQuestion("Name of project? ", function(data){
	pkg.name = data;
	pkg.title = data.charAt(0).toUpperCase() + data.slice(1);
});

addQuestion("What does the project do? ", function(data){
	pkg.description = data;
});

addQuestion("What is your name? ", function(data){
	pkg.author.name = data;
	pkg.repository.url = "git@github.com/";
	pkg.repository.url += pkg.author.name + '/';
	pkg.repository.url += pkg.name + '.git';
});

addQuestion("What is your email? ", function(data){
	pkg.author.email = data;
});

askNextQuestion();