module.exports = {
    "rules": {
        // Limit Cyclomatic Complexity
        // http://eslint.org/docs/rules/complexity
        //"complexity": [2, 2],
        // Require Consistent Returns
        // http://eslint.org/docs/rules/consistent-return
        "consistent-return": 2,
        // Require Following Curly Brace Conventions
        // http://eslint.org/docs/rules/curly
        "curly": [2, "all"],
        // Require Default Case in Switch Statements
        // http://eslint.org/docs/rules/default-case
        "default-case": 2,
        // Require Dot Notation
        // http://eslint.org/docs/rules/dot-notation
        "dot-notation": [2, {
            "allowKeywords": true,
        }],
        // Enforce newline before and after dot
        // http://eslint.org/docs/rules/dot-lotation
        "dot-location": [2, "property"],
        // Require === and !==
        // http://eslint.org/docs/rules/eqeqeq
        "eqeqeq": 2,
        // Make sure for-in loops have an if statement
        // http://eslint.org/docs/rules/guard-for-in
        "guard-for-in": 2,
        // Disallow the use of alert, confirm, and prompt
        // http://eslint.org/docs/rules/no-alert
        "no-alert": 2,
        // Disallow use of arguments.caller or arguments.callee
        // http://eslint.org/docs/rules/no-caller
        "no-caller": 2,
        // Disallow return in else
        // http://eslint.org/docs/rules/no-else-return
        "no-else-return": 2,
        // Disallow empty destructuring patterns
        // http://eslint.org/docs/rules/no-empty-pattern
        "no-empty-pattern": 2,
        // Disallow Null Comparisons
        // http://eslint.org/docs/rules/no-eq-null
        "no-eq-null": 2,
        // Disallow use of eval()
        // http://eslint.org/docs/rules/no-eval
        "no-eval": 2,
        // Disallow Extending of Native Objects
        // http://eslint.org/docs/rules/no-extend-native
        "no-extend-native": 2,
        // Disallow unnecessary function binding
        // http://eslint.org/docs/rules/no-extra-bind
        "no-extra-bind": 2,
        // Disallow Case Statement Fallthrough
        // http://eslint.org/docs/rules/no-fallthrough
        "no-fallthrough": 2,
        // Disallow Floating Decimals
        // http://eslint.org/docs/rules/no-floating-decimal
        "no-floating-decimal": 2,
        // Disallow the type conversion with shorter notations
        // http://eslint.org/docs/rules/no-implicit-coercion
        "no-implicit-coercion": 2,
        // Disallow Implied eval() via setTimeout(), setInterval() or execScript()
        // http://eslint.org/docs/rules/no-implied-eval
        "no-implied-eval": 2,
        // Disallow this keywords outside of classes or class-like objects
        // http://eslint.org/docs/rules/no-invalid-this
        "no-invalid-this": 2,
        // Disallow Unnecessary Nested Blocks
        // http://eslint.org/docs/rules/no-lone-blocks
        "no-lone-blocks": 2,
        // Disallow Function Creation in Loops
        // http://eslint.org/docs/rules/no-loop-func
        "no-loop-func": 2,
        // Disallow multiple spaces
        // http://eslint.org/docs/rules/no-multi-spaces
        "no-multi-spaces": 2,
        // Disallow Multiline Strings
        // http://eslint.org/docs/rules/no-multi-str
        "no-multi-str": 2,
        // Disallow Reassignment of Native Objects
        // http://eslint.org/docs/rules/no-native-reassign
        "no-native-reassign": 2,
        // Disallow Function Constructor
        // http://eslint.org/docs/rules/no-new-func
        "no-new-func": 2,
        // Disallow new For Side Effects
        // http://eslint.org/docs/rules/no-new
        //"no-new": 2,
        // Disallow Primitive Wrapper Instances
        // http://eslint.org/docs/rules/no-new-wrappers
        "no-new-wrappers": 2,
        // Disallow Octal Escapes
        // http://eslint.org/docs/rules/no-octal-escape
        "no-octal-escape": 2,
        // Disallow Octal Literals
        // http://eslint.org/docs/rules/no-octal
        "no-octal": 2,
        // Disallow Reassignment of Function Parameters
        // http://eslint.org/docs/rules/no-param-reassign
        "no-param-reassign": [2, {
            "props": false,
        }],
        // Disallow Use of __proto__
        // http://eslint.org/docs/rules/no-proto
        "no-proto": 2,
        // Disallow Redeclaring Variables
        // http://eslint.org/docs/rules/no-redeclare
        "no-redeclare": 2,
        // Disallow Assignment in Return Statement
        // http://eslint.org/docs/rules/no-return-assign
        "no-return-assign": 2,
        // Disallow Script URLs
        // http://eslint.org/docs/rules/no-script-url
        "no-script-url": 2,
        // Disallow Self Compare
        // http://eslint.org/docs/rules/no-self-compare
        "no-self-compare": 2,
        // Disallow Use of the Comma Operator
        // http://eslint.org/docs/rules/no-sequences
        "no-sequences": 2,
        // Disallow Unused Expressions
        // http://eslint.org/docs/rules/no-unused-expressions
        "no-unused-expressions": 2,
        // Disallow unnecessary .call() and .apply()
        // http://eslint.org/docs/rules/no-useless-call
        "no-useless-call": 2,
        // Disallow unnecessary concatenation of strings
        // http://eslint.org/docs/rules/no-useless-concat
        "no-useless-concat": 2,
        // Disallow with Statements
        // http://eslint.org/docs/rules/no-with
        "no-with": 2,
        // Require Radix Parameter of parseInt()
        // http://eslint.org/docs/rules/radix
        "radix": 2,
        // Disallow Yoda Conditions
        // http://eslint.org/docs/rules/yoda
        "yoda": [2, "never"],

        "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 3 }],
    },
};
