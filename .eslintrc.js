module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": false
    }
  },
  "extends": [
    "eslint:recommended"
  ],
  "plugins": [
    "babel",
    "promise"
  ],
  "env": {
    "node"  : true,
    "browser": false,
    "es6"   : true
  },
  "rules": {
    "no-console"           : "off",

    //Controversial rules
    "no-unused-vars"       : "warn",
    "prefer-template"      : "warn",
    "no-nested-ternary"    : "warn",
    "no-unneeded-ternary"  : "warn",
    "no-underscore-dangle" : "warn",
    "prefer-const"         : "warn",

    //General
    "arrow-body-style"     : ["error", "as-needed"],
    "no-var"               : "error",
    "no-duplicate-imports" : "error",

    //Style rules. Freely varies according to projects
    "quotes"               : ["error", "single",{
      "allowTemplateLiterals": true,
      "avoidEscape": true
    }],
    "max-len"              : ["error", {
      "code": 120,
      "tabWidth":2,
      "comments":120 //Separated max length for comments
    }],

    //Indents,whitespace settings
    "key-spacing"          : ["warn", {
      "singleLine":{
        "beforeColon": false,
        "afterColon": true
      },
      "multiLine": {
        "align": {
          "beforeColon": false,
          "afterColon": true,
          "on": "colon",
          "mode": "strict"
        }
      }
    }],
    "comma-spacing"        : ["error", {
      "before": false,
      "after": true
    }],
    "object-curly-spacing" : [2, "always"],
    "semi-spacing"         : ["error", {
      "before": false,
      "after": true
    }],
    "indent"               : [1,2,{
      "VariableDeclarator" : {
        "var"   : 2,
        "let"   : 2,
        "const" : 3
      },
      "FunctionDeclaration": {
        "parameters": "first"
      },
      "FunctionExpression": {
        "parameters": "first"
      },
      "MemberExpression": 1,
      "SwitchCase": 1
    }],
    "multiline-ternary"    : ["warn", "always"],
    "operator-linebreak": ["error", "after", {
      "overrides": {
        "?": "before",
        ":": "before"
      }
    }],
    "newline-per-chained-call": ["error", {
      "ignoreChainWithDepth": 2
    }],
    "keyword-spacing": ["error", { "before": true }],
    "space-unary-ops": ["error", {
      "words": true,
      "nonwords": false
    }],
    "no-whitespace-before-property": "error",
    "generator-star-spacing": ["error", {
      "before": false,
      "after": true
    }],
    "arrow-spacing": ["error", {
      "before": true,
      "after": true
    }],
    "space-before-function-paren": ["error", "never"],
    "rest-spread-spacing"  : ["error", "never"],

    //Strict best practices. No reason not to use this
    "no-alert"             : "error",
    "no-bitwise"           : "error",
    "no-caller"            : "error",
    "no-global-assign"     : "error",
    "no-eval"              : "error",
    "no-implied-eval"      : "error",
    "no-proto"             : "error",
    "no-iterator"          : "error",
    "no-lone-blocks"       : "error",
    "no-self-compare"      : "error",
    "no-invalid-regexp"    : ["error", {
      "allowConstructorFlags": ["u", "y"]
    }],
    "no-with"              : "error",
    "no-new-func"          : "error",
    "prefer-rest-params"   : "error",
    "prefer-spread"        : "error",
    //Unnecessary semicolon is an annoying visual clutter
    "no-extra-semi"        : "error",
    "semi"                 : ["error", "never"]
  }
}

// https://github.com/zerobias