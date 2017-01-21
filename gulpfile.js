var gulp = require('gulp');
var request = require('request');
var shell = require('gulp-shell');
var csv = require('csv');
var fs = require('fs');

gulp.task('default', ['start-admin', 'start-screen', 'start-server'])

gulp.task('start-admin', shell.task(['yarn run dev'], {'cwd': './client-admin'}))
gulp.task('start-screen', shell.task(['yarn run dev'], {'cwd': './client-screen'}))
gulp.task('start-server', shell.task(['node server.js'], {'cwd': './server'}))

gulp.task('get-rules', () => {
	var url = 'https://docs.google.com/spreadsheets/d/1UaMHsNlbtQZrP4IbKN41OZfnOOz4Ws_djoXrCEf9i4g/pub?output=csv';
	request(url, (error, response, body) => {
		csv.parse(body, (err, data) => {
			var wholeRulesRaw = data;
			var wholeRules = wholeRulesRaw.map(rule => {
				return rule[0][0].toUpperCase() + rule[0].slice(1) + '.';
			})

			var rules = {
				wholeRules: wholeRules
			}

			fs.writeFile('static/rules.json', JSON.stringify(rules), err => {console.log(err)});

		})
	})
})