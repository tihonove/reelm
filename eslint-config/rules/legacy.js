module.exports = {
    "rules": {
        // Limit Maximum Depth Blocks can be Nested
        // http://eslint.org/docs/rules/max-depth
        "max-depth": [2, 4],
        // Limit Maximum Length of Line
        // http://eslint.org/docs/rules/max-len
        "max-len": [2, 80, { "ignoreTrailingComments": true, "ignoreComments": true }],
        // Limit Maximum Number of Parameters
        // http://eslint.org/docs/rules/max-params
        "max-params": [2, 4],
        // Limit Maximum Number of Statements
        // http://eslint.org/docs/rules/max-statements
        "max-statements": [2, 40],
    },
};
