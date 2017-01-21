var gulp = require('gulp');
var request = require('request');
var shell = require('gulp-shell');
var csv = require('csv');
var jsonfile = require('jsonfile')

gulp.task('default', ['start-admin', 'start-screen', 'start-server'])

gulp.task('start-admin', shell.task(['yarn run dev'], {'cwd': './client-admin'}))
gulp.task('start-screen', shell.task(['yarn run dev'], {'cwd': './client-screen'}))
gulp.task('start-server', shell.task(['node server.js'], {'cwd': './server'}))

function getDataFromCsvUrl(url, callback) {
  request(url, (error, response, body) => {
    if (error) console.log(error);
    csv.parse(body, (err, data) => {
      if (err) console.log(err);
      callback(data);
    })
  })
}

var rules = {
  wordLists: {},
  listRules: []
}

gulp.task('get-rules', () => {
  var markRulesUrl = 'https://docs.google.com/spreadsheets/d/1UaMHsNlbtQZrP4IbKN41OZfnOOz4Ws_djoXrCEf9i4g/pub?output=csv';
  
  getDataFromCsvUrl(markRulesUrl, data => {
    var wholeRulesRaw = data;
    var wholeRules = wholeRulesRaw.map(rule => {
      return rule[0][0].toUpperCase() + rule[0].slice(1);
    })

    rules.wholeRules = wholeRules

    jsonfile.writeFileSync('static/rules.json', rules);
  });

  wordListUrls = [
    {
      category: 'locations',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=0&single=true&output=csv'
    },
    {
      category: 'emotions',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1164756710&single=true&output=csv'
    },
    {
      category: 'objects',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1213680938&single=true&output=csv'
    },
    {
      category: 'actions',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=334126540&single=true&output=csv'
    },
    {
      category: 'wants',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=162824816&single=true&output=csv'
    },
    {
      category: 'transitives',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1934984662&single=true&output=csv'
    },
    {
      category: 'creatures',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'speaking styles',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'scene styles',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'stage actions',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'states of being',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'personality traits',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1581990971&single=true&output=csv'
    },
    {
      category: 'physical affectations',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1975892510&single=true&output=csv'
    },
    {
      category: 'body parts',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=1975892510&single=true&output=csv'
    },
    {
      category: 'equipment',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=860946106&single=true&output=csv'
    },
    {
      category: 'time increments',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=860946106&single=true&output=csv'
    },
    {
      category: 'specific characters',
      url: 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=603840422&single=true&output=csv'
    }
  ]

  wordListUrls.forEach(o => {
    getDataFromCsvUrl(o.url, data => {
      let rule = data.splice(0, 1)
      let list = data.map(cell => { 
        return cell[0];
      }).filter(text => {
        return text.length > 0;
      })
      rules.wordLists[o.category] = list;
      rules.listRules.push(rule[0][0]);
      jsonfile.writeFileSync('static/rules.json', rules);
    });    
  })



})