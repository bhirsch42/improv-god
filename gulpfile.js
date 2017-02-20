var gulp = require('gulp');
var request = require('request');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var open = require('gulp-open');
var csv = require('csv');
var os = require('os');
var jsonfile = require('jsonfile');
var _ = require('lodash');

gulp.task('default', () => {
  exec('node server.js', {'cwd': './server'});
  gulp.src('').pipe(open({uri: 'http://localhost:8082/admin'}))
  gulp.src('').pipe(open({uri: 'http://localhost:8082/screen'}))
})


gulp.task('dev', () => {
  exec('yarn run dev', {'cwd': './client-admin'});
  exec('yarn run dev', {'cwd': './client-screen'});
  exec('node server.js', {'cwd': './server'});
})

gulp.task('build', (done) => {
  callbackCounter = 0
  cb = () => {
    callbackCounter++;
    if (callbackCounter == 2) {
      gulp.src(['./client-admin/dist/static/**', './client-screen/dist/static/**'])
        .pipe(gulp.dest('./static'))
      done()
    }
  }

  exec('yarn run build', {'cwd': './client-admin'}, () => {
    gulp.src('./client-admin/dist/index.html')
      .pipe(replace('/static/', '/admin/static/'))
      .pipe(gulp.dest('./client-admin/dist/', {overwrite: true}))
    cb()
  });

  exec('yarn run build', {'cwd': './client-screen'}, () => {
    gulp.src('./client-screen/dist/index.html')
      .pipe(replace('/static/', '/screen/static/'))
      .pipe(gulp.dest('./client-screen/dist/', {overwrite: true}))
    cb()
  });


})


gulp.task('install', (done) => {
  callbackCounter = 0
  cb = () => {
    callbackCounter++;
    if (callbackCounter == 3) {
      done()
    }
  }

  exec('yarn', {'cwd': './client-admin'}, cb);
  exec('yarn', {'cwd': './client-screen'}, cb);
  exec('yarn', {'cwd': './server'}, cb);  
})

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
  rules: [],
  words: {}
}

function addNumVariations(rules) {
  var names = ['Ben', 'Bret', 'Mark', 'Sara'] // Four is probably a good number, right?
  var total;
  var accum = 0;

  var improviser = () => {
    total = total
  }

  var pronoun = () => {
    total = total
  }

  var uniqueImproviser = () => {
    total *= names.length;
  }

  var lastCategory = '';

  var getWord = category => {
    lastCategory = category;
    total *= rules.words[category].length;
  }

  rules.rules.forEach((rule, i) => {
    total = 1;
    try {
      eval(rule.template);      
    } catch(e) {
      console.log('error in', i + 2, rule.template)
      console.log('\t' + e.toString().split('\n')[0] + '\n\t' + 'last category: ' + lastCategory);
    }
    let probWidth = Math.log(total) / Math.log(10);
    if (probWidth < 1) probWidth = 1;
    accum += probWidth
    rule.probCeil = accum;
  })

  // normalize
  rules.rules.forEach((rule, i) => {
    rule.probCeil /= rules.rules[rules.rules.length - 1].probCeil
  })

  jsonfile.writeFileSync('static/rules.json', rules);
}

gulp.task('get-rules', () => {
  var rulesUrl = 'https://docs.google.com/spreadsheets/d/1UaMHsNlbtQZrP4IbKN41OZfnOOz4Ws_djoXrCEf9i4g/pub?output=csv';
  var gotRules = false;
  var gotWords = false;


  getDataFromCsvUrl(rulesUrl, data => {
    console.log('retrieved rules')
    data.splice(0, 1);
    rules.rules = data.map((rule) => {
      return {
        template: '`' + rule[0] + '`',
        reverseTemplate: '`' + rule[1] + '`',
        after: rule[2],
        until: rule[3],
      }
    })
    jsonfile.writeFileSync('static/rules.json', rules);
    console.log('wrote rules')
    gotRules = true;
    if (gotWords && gotRules) addNumVariations(rules);
  });


  var wordsUrl = 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=0&single=true&output=csv'

  getDataFromCsvUrl(wordsUrl, data => {
    console.log('retrieved words')
    var wordArrays = _.unzip(data);
    wordArrays.forEach((wordArray) => {
      let category = wordArray.splice(0, 1)[0];
      rules.words[category] = wordArray.filter((word) => {return word.length > 0});
    })
    jsonfile.writeFileSync('static/rules.json', rules);
    console.log('wrote words')
    gotWords = true;
    if (gotWords && gotRules) addNumVariations(rules);
  });    
})