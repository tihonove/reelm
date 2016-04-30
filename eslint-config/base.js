module.exports = {
    "extends": [
        "./rules/best-practices.js",
        "./rules/errors.js",
        "./rules/es2015.js",
        "./rules/legacy.js",
        "./rules/strict.js",
        "./rules/style.js",
        "./rules/variables.js",
    ],
    // https://github.com/babel/babel-eslint
    "parser": "babel-eslint",
    // http://eslint.org/docs/user-guide/configuring.html#specifying-environments
    "env": {
        // browser global variables
        "browser": true,
        // enable all ECMAScript 6 features except for modules
        "es6": true,
        // Node.js global variables and Node.js-specific rules
        "node": true,
    },
    "ecmaFeatures": {
        // enable ES6 modules and global strict mode
        "modules": true,
    },
    "rules": {},
    "plugins": [
        "babel",
    ],
};
