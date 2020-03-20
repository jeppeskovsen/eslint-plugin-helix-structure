
import { RuleTester } from "eslint"
import rule from "./restricted-tilde-imports";
import { test, testFilePath } from "../utils/testing"

const ruleTester = new RuleTester()

ruleTester.run("restricted-tilde-imports", rule, {

  valid: [
    test({
      code: 'import "~/foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test({
      code: 'import "./Subfolder/Subfile"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
  ],


  invalid: [
    test({
      code: 'import "../../foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: "Unexpected path '../../foundation/BaseBanner', use tilde (~/foundation) import paths when it's from a different layer than feature.",
        line: 1,
        column: 8,
      }]
    }),
  ]
})