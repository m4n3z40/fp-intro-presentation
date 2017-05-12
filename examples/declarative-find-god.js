const { and, compose, partialRight, either, identity, not } = require('./fp-utils');
const words = [
    'The', 'quick', 'brown', 'fox,', 'jumps', 'over', 
    'the', 'lazy', 'dog.', '- It', 'was', 'a', 'german', 
    'shepherd!'
];
const removeInvalidChars = word => word.replace(/[ -_:;.,!\?]/g, '');
const enoughChars = word => word.length >= 3;
const notManyChars = word => word.length <= 6;
const canContainGod = and(enoughChars, notManyChars);
const toUpperCase = word => word.toUpperCase();
const reverseStr = word => word.split('').reverse().join('');
const toBibleCode = compose(reverseStr, toUpperCase);
const isGod = word => word === 'GOD';
const booleanEither = partialRight(either, false, identity);
const findGod = words => words
    .map(removeInvalidChars)
    .filter(canContainGod)
    .map(toBibleCode)
    .some(isGod);
const safelyFindGod = compose(booleanEither, findGod);
const wordsMutated = words => words[0] !== 'The';

safelyFindGod(words)
    .map(() => console.log('Found GOD...'));

either(words, '...and the devil', not(wordsMutated))
    .map(null, msg => console.log(msg));
