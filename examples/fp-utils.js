const identity = obj => obj;

const partial = 
        (fn, ...eagerArgs) => 
            (...lazyArgs) => fn(...eagerArgs, ...lazyArgs);
    
const partialRight =
    (fn, ...eagerArgs) =>
        (...lazyArgs) => fn(...lazyArgs, ...eagerArgs);

const autoCurry = (fn, arity = fn.length) =>
    (...args) =>
        args.length >= arity ?
            fn(...args) :
            autoCurry(partial(fn, ...args), arity - args.length);

const compose = 
    (...fns) => 
        (...args) => fns.slice(0, -1).reduceRight((res, fn) => fn(res), fns[fns.length - 1](...args));

const pipe = 
    (firstFn, ...restFns) => 
        (...args) => restFns.reduce((res, fn) => fn(res), firstFn(...args));

const and = 
    (...fns) =>
        (...args) => fns.every(fn => fn(...args));

const or = 
    (...fns) =>
        (...args) => fns.some(fn => fn(...args));

const not = fn => (...args) => !fn(...args);

const nothingSymbol = Symbol('nothing');

const isNothing = val => (
    val === undefined || 
    val === null || 
    val[nothingSymbol] === true
);

const isSomething = not(isNothing);

const nothing = (value = null) => ({
    [nothingSymbol]: true,
    map: fn => this,
    flatMap: fn => this,
    apply: monad => this,
    getValue: () => null
});

const something = (value = null) => ({
    map: fn => something(fn(value)),
    flatMap: fn => fn(value),
    apply: monad => monad.map(value),
    getValue: () => value
});

const maybe = (value = null) => ({
    map: fn => isNothing(value) ? nothing() : maybe(fn(val)),
    flatMap: fn => isNothing(value) ? nothing() : fn(value),
    apply: monad => isNothing(value) ? nothing() : monad.map(value),
    getValue: () => value
});

const left = (valueLeft = null, valueRight = null) => ({
    map: (fnLeft, fnRight) => fnLeft ? left(fnLeft(valueLeft)) : this,
    flatMap: (fnLeft, fnRight) => fnLeft ? fnLeft(valueLeft) : this,
    apply: (monadLeft, monadRight) => monadLeft ? monadLeft.map(valueLeft) : this,
    whenLeft: (fn) => left(fn(valueLeft)),
    whenRight: (fn) => this,
    getLeft: () => valueLeft,
    getRight: () => valueRight
});

const right = (valueLeft = null, valueRight = null) => ({
    map: (fnLeft, fnRight) => fnRight ? right(fnRight(valueRight)) : this,
    flatMap: (fnLeft, fnRight) => fnRight ? fnRight(valueRight) : this,
    apply: (monadLeft, monadRight) => monadRight ? monadRight.map(valueRight) : this,
    whenLeft: (fn) => this,
    whenRight: (fn) => right(fn(valueRight)),
    getLeft: () => valueLeft,
    getRight: () => valueRight
});

const either = 
    (valueLeft = null, valueRight = null, evaluate = isSomething) => 
        evaluate(valueLeft, valueRight) ? 
            left(valueLeft, valueRight) : 
            right(valueLeft, valueRight);

module.exports = {
    identity,
    partial,
    partialRight,
    curry,
    compose,
    pipe,
    and,
    or,
    not,
    nothing,
    something,
    maybe,
    left,
    right,
    either
}
