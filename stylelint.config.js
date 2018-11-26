module.exports = {
  processors: ['stylelint-processor-arbitrary-tags'],
  extends: 'stylelint-config-standard',
  rules: {
    'block-opening-brace-space-before': 'always',
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'number-leading-zero': null,
    'block-closing-brace-newline-before': null,
  }
}
