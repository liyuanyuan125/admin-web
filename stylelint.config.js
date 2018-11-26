module.exports = {
  processors: ['stylelint-processor-arbitrary-tags'],
  extends: 'stylelint-config-standard',
  rules: {
    'block-opening-brace-space-before': 'always',
    'at-rule-empty-line-before': false,
    'rule-empty-line-before': false,
    'number-leading-zero': false,
  }
}
