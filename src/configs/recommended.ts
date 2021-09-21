export default {
  plugins: [
    "helix-structure"
  ],
  rules: {
    "helix-structure/restricted-imports": ["error", { 
      "basePath": "./src",
      "ignoreCommonProject": true
    }],
    "helix-structure/restricted-tilde-imports": ["error", {
      "basePath": "./src", 
      "ignoreFix": false
    }],
  }
}