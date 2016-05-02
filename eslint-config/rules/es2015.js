module.exports = {
    "rules": {
        // Require parens in arrow function arguments
        // http://eslint.org/docs/rules/arrow-parens
        "arrow-parens": 0,
        "babel/arrow-parens": [2, "as-needed"],
        // Require space before/after arrow function's arrow
        // http://eslint.org/docs/rules/arrow-spacing
        "arrow-spacing": [2, {
            "before": true,
            "after": true,
        }],
        // Verify calls of super() in constructors
        // http://eslint.org/docs/rules/constructor-super
        "constructor-super": 2,
        // Enforce spacing around the * in generator functions
        // http://eslint.org/docs/rules/generator-star-spacing
        "generator-star-spacing": 0,
        "babel/generator-star-spacing": [2, {
            "before": false,
            "after": true,
        }],
        // Disallow duplicate name in class members
        // http://eslint.org/docs/rules/no-dupe-class-members
        "no-dupe-class-members": 2,
        // Disallow use of this/super before calling super() in constructors
        // http://eslint.org/docs/rules/no-this-before-super
        "no-this-before-super": 2,
        // Require let or const instead of var
        // http://eslint.org/docs/rules/no-var
        "no-var": 2,
        // Suggest using arrow functions as callbacks
        // http://eslint.org/docs/rules/prefer-arrow-callback
        "prefer-arrow-callback": 2,
        // Suggest using const, if a variable is never modified
        // http://eslint.org/docs/rules/prefer-const
        "prefer-const": 2,
        // Suggest using the spread operator instead of .apply()
        // http://eslint.org/docs/rules/prefer-spread
        "prefer-spread": 2,
        // Suggest using template literals instead of string concatenation
        // http://eslint.org/docs/rules/prefer-template
        "prefer-template": 0,

        /*
        "babel/new-cap": 1,
        "babel/array-bracket-spacing": 1,
        "babel/object-curly-spacing": 1,
        "babel/object-shorthand": 1,
        "babel/no-await-in-loop": 1,
        "babel/flow-object-type": 1,
        */
    },
};
