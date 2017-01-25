
#How to add rules
##Rule templates
The first column of the spreadsheet is for **rule templates**. Rule templates let you type a rule that the computer can pick, and leave blanks that the computer will fill with random words or the names of improvisers.

Fill-in-the-blanks must be wrapped in this syntax: `${<BLANK>}`
Where `<BLANK>` is one of the following:

- `improviser()`
    - This inserts one of the improvisers names.
    - Ex. `${improviser()} answers to every character's name`
- `improviserOrEveryone()`
    - This inserts one of the improvisers names, or the word "everyone".
    - Ex. `${improviserOrEveryone()} is constantly entering and leaving the scene`
- `uniqueImproviser()`
    - Like `improviser()`, this inserts one of the improvisers names. But, if you use it more than once in the same rule, it will never insert the same name twice, whereas `improviser()` might do so.
    - Ex. `${uniqueImproviser()} and ${uniqueImproviser()} swap characters`
- `getWord(<CATEGORY>)`
    - This inserts a random word from the specified category. The following categories are supported:
        - `locations`, `emotions`, `objects`, `actions`, `wants`, `transitives`, `creatures`, `speaking styles`, `scene styles`, `stage actions`, `states of being`, `personality traits`, `physical affectations`, `body parts`, `equipment`, `time increments`, `specific characters`
    - Ex. `The scene is teleported ${getWord("time increments")} into the future`

## After rule
The second column of the spreadsheet tells the computer what to do **after it reads that rule**.

## Until
The third column of the spreadsheet tolls the computer when to stop doing the stuff you told it to do in the second column.

---

## Technical details

All of the logic in the application is written in JavaScript.

**Rule templates** are wrapped in tick marks, then run with `eval()`.
The **After Rule** is just run with `eval()`
The **Until** is run with `eval()` either on a timeout, or as a callback depending on the contents of the **After Rule**.