
import { RuleTester } from "eslint"
import * as rule from "./restricted-imports";
import { test, testFilePath } from "../utils/testing"

const ruleTester = new RuleTester()

ruleTester.run("restricted-imports", rule, {
  valid: [
    test({
      code: 'import a from "../client/a.js"',
      filename: testFilePath('./restricted-paths/server/b.js'),
      options: [{
        basePath: "./src"
      }],
    }),
  ],
  invalid: []
})