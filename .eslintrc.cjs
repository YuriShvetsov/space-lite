module.exports = {
  extends: [
    'semistandard',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    'eol-last': 2,
    semi: 0,
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    'no-unused-vars': 0,
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 0
  }
};
