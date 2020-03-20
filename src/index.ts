export const rules = {
  rules: {
    'restricted-imports': require('./rules/restricted-imports').default,
    'restricted-tilde-imports': require('./rules/restricted-tilde-imports').default,
  }
};
