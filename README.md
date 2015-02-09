# Gask

Script to scaffold your project's gulp tasks

## Set Up

First, update `gask.js` so it uses the path to your gulp task source directory

Second, update `gask.js` to the correct destination directory for saving
your tasks to your project.

Finally, make sure the file is executable.
`chmod u+x gask.js`

## Usage

Call it as you would any other shell script:

`path/to/gask.js gulp-jshint gulp-jscs`


## What Just Happened?

Gask just copied the specified gulp tasks to your detination directory.
It also - as a service to you at no charge - scraped those tasks for any
necessary Dev Dependencies, and installed them with NPM.