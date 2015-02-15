#!/usr/bin/env node

var readline = require('readline');
var fs = require('fs');

var git

var package = {
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


rl.question('Name of project? ', function(data){
	package.name = data;
	package.title = data.charAt(0).toUpperCase() + data.slice(1);

	rl.question('What does this project do? ', function(data){
		package.description = data;

		rl.question('What is your name? ', function(data){
			package.author.name = data;
			package.repository.url = "git@github.com/";
			package.repository.url += package.author.name + '/';
			package.repository.url += package.name + '.git';

			rl.question('What is your email? ', function(data){
				package.author.email = data;

				fs.writeFileSync(process.cwd() + '/package.json', JSON.stringify(package) ,'utf8');

				rl.close();
			});
		});
	});
});





