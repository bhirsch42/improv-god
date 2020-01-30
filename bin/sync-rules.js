const request = require('request');
const csv = require('csv');
const jsonfile = require('jsonfile');
const _ = require('lodash');

const RULES_URL = 'https://docs.google.com/spreadsheets/d/144kU1ikxMGb8NPLHkKI97Q3YsssP_EUtVHAuTd3Y_v0/pub?gid=0&single=true&output=csv';
const WORDS_URL = 'https://docs.google.com/spreadsheets/d/1zHZqRK-fcK0Bv7wosGMR9s2sXhQG-ucuZADdeveWuEQ/pub?gid=0&single=true&output=csv';
const OUTPUT_PATH = 'src/assets/rules.json';

function getDataFromCsvUrl(url, callback) {
  request(url, (error, response, body) => {
    if (error) console.log(error);
    csv.parse(body, (err, data) => {
      if (err) console.log(err);
      callback(data);
    })
  })
}

let rules = {
  rules: [],
  words: {}
}

function addNumVariations(rules) {
  let names = ['Ben', 'Bret', 'Mark', 'Sara'] // Four is probably a good number, right?
  let total;
  let accum = 0;

  let improviser = () => {
    total = total
  }

  let pronoun = () => {
    total = total
  }

  let uniqueImproviser = () => {
    total *= names.length;
  }

  let lastCategory = '';

  let getWord = category => {
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

  jsonfile.writeFileSync(OUTPUT_PATH, rules);
}

function syncRules() {
  let gotRules = false;
  let gotWords = false;

  getDataFromCsvUrl(RULES_URL, data => {
    console.log('retrieved rules')
    data.splice(0, 1);
    rules.rules = data.map((rule) => {
      return {
        template: '`' + rule[0] + '`',
        reverseTemplate: '`' + rule[1] + '`',
        maxDuration: rule[2],
        lateGame: rule[3],
        isCommand: rule[4]
      }
    })
    jsonfile.writeFileSync(OUTPUT_PATH, rules);
    console.log('wrote rules')
    gotRules = true;
    if (gotWords && gotRules) addNumVariations(rules);
  });

  getDataFromCsvUrl(WORDS_URL, data => {
    console.log('retrieved words')
    let wordArrays = _.unzip(data);
    wordArrays.forEach((wordArray) => {
      let category = wordArray.splice(0, 1)[0];
      rules.words[category] = wordArray.filter((word) => {return word.length > 0});
    })
    jsonfile.writeFileSync(OUTPUT_PATH, rules);
    console.log('wrote words')
    gotWords = true;
    if (gotWords && gotRules) addNumVariations(rules);
  });
}

syncRules();
