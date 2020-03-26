export const rules = {
  "restricted-imports": require("./rules/restricted-imports").default,
  "restricted-tilde-imports": require("./rules/restricted-tilde-imports").default,
};

export const configs = {
  "recommended": require("../configs/recommended").default
}