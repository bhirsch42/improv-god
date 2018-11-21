import _ from 'lodash'

function RuleGenerator({improvisers, improviserPool, ruleData, allowRepeats}) {
  this.improviserPool = improviserPool
  this.improvisers = this.improviserPool ? [] : improvisers
	this.ruleData = _.clone(ruleData)
	this.allowRepeats = allowRepeats || false

  this.selectionCount = {}
}

RuleGenerator.prototype.getImprovisers = function() {
  return this.improvisers
}

RuleGenerator.prototype.addImprovisers = function(addCount) {
  return [...new Array(addCount)].map(() => this.addImproviser())
}

RuleGenerator.prototype.addImproviser = function() {
  let offstageImprovisers = _.xor(this.improviserPool, this.improvisers)
  console.log("SORTED", this.sortBySelectionCount(offstageImprovisers, false).map(o => o.name))
  let improviser = this.getBySelectionCount(offstageImprovisers, false)
  console.log(this.selectionCount)
  this.improvisers.push(improviser)
  return improviser
}

RuleGenerator.prototype.removeImprovisers = function(removeCount) {
  return [...new Array(removeCount)].map(() => this.removeImproviser())
}

RuleGenerator.prototype.removeImproviser = function() {
  let improviser = this.getBySelectionCount(this.improvisers)
  this.improvisers = _.without(this.improvisers, improviser)
  return improviser
}

RuleGenerator.prototype.incrementSelectionCount = function(name) {
  this.selectionCount[name] = (this.selectionCount[name] || 0) + 1
}

RuleGenerator.prototype.getSelectionCount = function(name) {
  return typeof(this.selectionCount[name]) == 'undefined' ? 0 : this.selectionCount[name]
}

RuleGenerator.prototype.sortBySelectionCount = function(people, reverse=false) {
  let result = people.sort((person1, person2) => {return this.getSelectionCount(person1.name) - this.getSelectionCount(person2.name)});

  if (reverse) {
    result = result.reverse()
  }

  return result
}

RuleGenerator.prototype.getBySelectionCount = function(people, reverse=false) {
  this.shuffle(people);
  this.sortBySelectionCount(people, reverse);

  let person = people[0];
  this.incrementSelectionCount(person.name);
  return person
}

RuleGenerator.prototype.shuffle = function(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

RuleGenerator.prototype.random = function(arr) {
  let person = arr[parseInt(Math.random() * arr.length)]
  return person;
}

RuleGenerator.prototype.randInd = function(arr) {
  return parseInt(Math.random() * arr.length);
}

RuleGenerator.prototype.selectRule = function(rules) {
  let r = Math.random()
  for (var i = 0; i < rules.length; i++) {
    if (rules[i].probCeil > r)
      return rules[i];
  }
}

RuleGenerator.prototype.generateReverseRuleText = function(ruleGen, ruleFills) {
  let index = 0;
  let improviser, uniqueImproviser, getWord, ruleFill, pronoun;
  improviser = uniqueImproviser = getWord = pronoun = () => {
    ruleFill = ruleFills[index];
    index++;
    return ruleFill
  }
  if (ruleGen.reverseTemplate.length == 0) {
    return eval(ruleGen.reverseTemplate);
  }

  let rule = eval(ruleGen.template);

  let improviserName = ruleFills[0];
  if (rule.match(`${improviserName} is `)) {
    return rule.replace(`${improviserName} is `, `${improviserName} is no longer `);
  } else if (rule.match(`${improviserName} `)) {
    return rule.replace(`${improviserName} `, `${improviserName} no longer `);
  }

  return `The following rule no longer applies: ${rule}`
}

RuleGenerator.prototype.sentenceify = function(s) {
  s = s.charAt(0).toUpperCase() + s.slice(1);
  s = s.charAt(s.length - 1) == '.' ? s : s + '.'
  return s
}

RuleGenerator.prototype.generateRule = function(ruleIndex) {
  let ruleFills = []
  let improvisersMentioned = []

  let uniqueImprovisers = _.clone(this.improvisers);


  let improviser = () => {
    let choices = this.improvisers.concat({
      name: 'everyone',
      pronouns: {
        subjective: 'they',
        objective: 'them',
        possessive: 'their'
      }
    });
    let ans = this.getBySelectionCount(choices).name;
    ruleFills.push(ans);
    improvisersMentioned.push(ans);
    return ans;
  }

  let uniqueImproviser = () => {
    let ans = this.getBySelectionCount(uniqueImprovisers);
    uniqueImprovisers.splice(uniqueImprovisers.indexOf(ans), 1);
    ruleFills.push(ans.name);
    improvisersMentioned.push(ans.name)
    return ans.name;
  }

  let getWord = category => {
    let ans = this.random(this.ruleData.words[category]);
    ruleFills.push(ans);
    return ans;
  }

  let pronoun = (tense) => {
    let pronoun = null;
    let person = this.improvisers.concat({
      name: 'everyone',
      pronouns: {
        subjective: 'they',
        objective: 'them',
        possessive: 'their'
      }
    }).find(p => ruleFills.indexOf(p.name) > -1);
    if (!person) {
      person = this.improvisers[0]
      console.log('pronoun uh oh')
    }
    if (tense == 'objective' || tense == 'possessive') {
      pronoun = person.pronouns[tense];
    } else {
      pronoun = person.pronouns.subjective
    }
    ruleFills.push(pronoun);
    return pronoun;
  }

  let parseRuleGen = (ruleGen) => {
    return eval(ruleGen.template);
  }

  let selectedRule = typeof ruleIndex == 'number' ? this.ruleData.rules[ruleIndex] : this.selectRule(this.ruleData.rules);

  if (!this.allowRepeats) {
    this.ruleData.rules.splice(this.ruleData.rules.indexOf(selectedRule), 1);
  }

  let rule = parseRuleGen(selectedRule);

  rule = rule.replace('they has', 'they have');
  rule = rule.replace('they is', 'they are');

  return {
  	text: this.sentenceify(rule),
  	removalText: this.sentenceify(this.generateReverseRuleText(selectedRule, ruleFills)),
  	removing: false,
  	lateGame: selectedRule.lateGame,
  	isCommand: selectedRule.isCommand,
  	maxDuration: selectedRule.maxDuration,
  	timeCreated: Date.now(),
    improvisers: improvisersMentioned
  }
}

export default RuleGenerator