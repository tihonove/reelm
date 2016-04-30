module.exports = {
  "rules": {
    // Disallow Variables Deletion
    // http://eslint.org/docs/rules/no-delete-var
    "no-delete-var": 2,
    // Disallow Shadowing of Restricted Names
    // http://eslint.org/docs/rules/no-shadow-restricted-names
    "no-shadow-restricted-names": 2,
    // http://eslint.org/docs/rules/no-shadow
    //"no-shadow": 2,
    // Disallow Initializing to undefined
    // http://eslint.org/docs/rules/no-undef-init
    "no-undef-init": 2,
    // Disallow Undeclared Variables
    // http://eslint.org/docs/rules/no-undef
    "no-undef": 2,
    // Disallow Unused Variables
    // http://eslint.org/docs/rules/no-unused-vars
    "no-unused-vars": [2, {
      // checks only that locally-declared variables are used but will allow
      // global variables to be unused
      "vars": "local",
      // only the last argument must be used
      "args": "after-used",
    }],
  },
};
