
import { RuleTester } from "eslint"
import rule from "./restricted-imports";
import { test, testFilePath } from "../utils/testing"

const ruleTester = new RuleTester()

ruleTester.run("restricted-imports", rule, {

  valid: [
    test({
      code: 'import "../../foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test({
      code: 'import "../../foundation/Utils"',
      filename: testFilePath("./files/foundation/BaseBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test({
      code: 'import "../../foundation/Utils"',
      filename: testFilePath("./files/Project/Eslint/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test({
      code: 'import "../../feature/SuperBanner"',
      filename: testFilePath("./files/Project/Eslint/index.js"),
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
      code: 'import "../SuperBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: 'Unexpected path "../SuperBanner". Cannot import feature into a another feature.',
        line: 1,
        column: 8,
      }]
    }),
    test({
      code: 'import "../../feature/SuperBanner"\nimport "../../project/Eslint"',
      filename: testFilePath("./files/foundation/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: 'Unexpected path "../../feature/SuperBanner". Cannot import feature into foundation.',
        line: 1,
        column: 8,
      }, {
        message: 'Unexpected path "../../project/Eslint". Cannot import project into foundation.',
        line: 2,
        column: 8,
      }]
    }),
  ]
})