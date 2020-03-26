# eslint-plugin-helix-structure

Install via npm:
```
npm install eslint-plugin-helix-structure --save-dev
```

.eslintrc:
```javascript
"extends": [
  "plugin:helix-structure/recommended",
],
"plugins": [
  "helix-structure"
],
"rules": {
  "helix-structure/restricted-imports": ["error", { "basePath": "./src" }],
  "helix-structure/restricted-tilde-imports": ["error", { "basePath": "./src", "ignoreFix": false }],
  ...
```
 