export default {
  plugins: [
    "helix-structure"
  ],
  rules: {
    "helix-structure/restricted-imports": ["error", { 
      "basePath": "./src" 
    }],
    "helix-structure/restricted-tilde-imports": ["error", {
      "basePath": "./src", 
      "ignoreFix": false 
    }],
  }
}