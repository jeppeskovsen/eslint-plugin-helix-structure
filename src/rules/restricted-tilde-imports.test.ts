
import { RuleTester } from "eslint"
import rule, { messages } from "./restricted-tilde-imports"
import { test, testFilePath, message } from "../utils/testing"

const ruleTester = new RuleTester()

ruleTester.run("restricted-tilde-imports", rule, {

  valid: [
    test<RuleTester.ValidTestCase>({
      code: 'import "~/foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
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
  ],


  invalid: [
    test<RuleTester.InvalidTestCase>({
      code: `
        import "~/foundation/Utils"
        import '../../foundation/BaseBanner'

        var test = "HEJ"
      `,
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      output: `
        import "~/foundation/Utils"
        import '~/foundation/BaseBanner'

        var test = "HEJ"
      `,
      errors: [{
        message: message(messages.useTilde, { 
          importPath: "../../foundation/BaseBanner", 
          importLayerName: "foundation", 
          currentLayerName: "feature" 
        }),
        line: 3,
        column: 16,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: `
        import "~/foundation/Utils"
        import '~/feature/AwesomeBanner/Subfolder/Subfile'

        var test = "HEJ"
      `,
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      output: `
        import "~/foundation/Utils"
        import './Subfolder/Subfile'

        var test = "HEJ"
      `,
      errors: [{
        message: message(messages.useRelative, { 
          importPath: "~/feature/AwesomeBanner/Subfolder/Subfile", 
          moduleName: "awesomebanner",
        }),
        line: 3,
        column: 16,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "../../foundation/BaseBanner"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      output: `import "~/foundation/BaseBanner"`,
      errors: [{
        message: message(messages.useTilde, { 
          importPath: "../../foundation/BaseBanner", 
          importLayerName: "foundation", 
          currentLayerName: "feature" 
        }),
        line: 1,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "~/feature/AwesomeBanner/Subfolder/Subfile"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      output: `import "./Subfolder/Subfile"`,
      errors: [{
        message: message(messages.useRelative, { 
          importPath: "~/feature/AwesomeBanner/Subfolder/Subfile", 
          moduleName: "awesomebanner",
        }),
        line: 1,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "~/feature/AwesomeBanner/Subfolder/NotExists"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files"
      }],
      output: `import "~/feature/AwesomeBanner/Subfolder/NotExists"`,
      errors: [{
        message: message(messages.useRelative, { 
          importPath: "~/feature/AwesomeBanner/Subfolder/NotExists", 
          moduleName: "awesomebanner",
        }),
        line: 1,
        column: 8,
      }]
    }),
    test<RuleTester.InvalidTestCase>({
      code: 'import "~/feature/AwesomeBanner/Subfolder/Subfile"',
      filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
      options: [{
        basePath: "./tests/files",
        ignoreFix: true
      }],
      output: `import "~/feature/AwesomeBanner/Subfolder/Subfile"`,
      errors: [{
        message: message(messages.useRelative, { 
          importPath: "~/feature/AwesomeBanner/Subfolder/Subfile", 
          moduleName: "awesomebanner",
        }),
        line: 1,
        column: 8,
      }]
    })
  ]
})