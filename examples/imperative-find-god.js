const words = [
    'The', 'quick', 'brown', 'fox,', 'jumps', 'over', 
    'the', 'lazy', 'dog.', '- It', 'was', 'a', 'german', 
    'shepherd!'
];
let result = false;

for (let i = 0; i < words.length; i++) {
    words[i] = words[i].replace(/[ -_:;.,!\?]/g, '');
    
    if (words[i].length >= 3 && words[i].length <= 6) {
        words[i] = words[i].toUpperCase().split('').reverse().join('');

        if (words[i] === 'GOD') {
            result = true;
            break;
        }
    }
}

if (result) {
    console.log('Found GOD...');
}

if (words[0] !== 'The') {
    console.log('...and the devil');
}
