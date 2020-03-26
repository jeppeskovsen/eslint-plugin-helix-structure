
import { RuleTester } from "eslint"
import rule, { messages } from "./restricted-imports"
import { test, testFilePath, message } from "../utils/testing"

const ruleTester = new RuleTester()

ruleTester.run("restricted-imports", rule, {

  valid: [
    test<RuleTester.ValidTestCase>({
      code: 'import "../../foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test<RuleTester.ValidTestCase>({
      code: 'import "../../foundation/Utils"',
      filename: testFilePath("./files/foundation/BaseBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test<RuleTester.ValidTestCase>({
      code: 'import "../../foundation/Utils"',
      filename: testFilePath("./files/Project/Eslint/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test<RuleTester.ValidTestCase>({
      code: 'import "../../feature/SuperBanner"',
      filename: testFilePath("./files/Project/Eslint/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test<RuleTester.ValidTestCase>({
      code: 'import "./Subfolder/Subfile"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
    test<RuleTester.ValidTestCase>({
      code: 'import "./Subfolder/Subfile"',
      filename: testFilePath("./files/project/Eslint/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
    }),
  ],


  invalid: [
    test<RuleTester.InvalidTestCase>({
      code: 'import "../SuperBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: message(messages.featureIntoFeature, { importPath: "../SuperBanner" }),
        line: 1,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "../../feature/SuperBanner"\nimport "../../project/Eslint"',
      filename: testFilePath("./files/foundation/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: message(messages.featureIntoFoundation, { importPath: "../../feature/SuperBanner" }),
        line: 1,
        column: 8,
      }, {
        message: message(messages.projectIntoFoundation, { importPath: "../../project/Eslint" }),
        line: 2,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "../../project/Eslint"',
      filename: testFilePath("./files/feature/SuperBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: message(messages.projectIntoFeature, { importPath: "../../project/Eslint" }),
        line: 1,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "../Other"',
      filename: testFilePath("./files/project/Eslint/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      errors: [{
        message: message(messages.projectIntoProject, { importPath: "../Other" }),
        line: 1,
        column: 8,
      }]
    }),
  ]
})