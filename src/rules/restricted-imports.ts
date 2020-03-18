//import containsPath from "contains-path"
import path from "path"
import { isStaticRequire } from "../utils/static-require"

// import resolve from "eslint-module-utils/resolve"
// import importType from "../core/importType"

module.exports = {
  meta: {
    type: "problem",
    docs: {
      url: "todo",
    },

    schema: [
      {
        type: "object",
        properties: {
          basePath: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function noRestrictedPaths(context) {
    const options = context.options[0] || {}
    const restrictedPaths = options.basePath || []
    const basePath = options.basePath || process.cwd()
    const currentFilename = context.getFilename()
    // const matchingZones = restrictedPaths.filter((zone) => {
    //   const targetPath = path.resolve(basePath, zone.target)

    //   return containsPath(currentFilename, targetPath)
    // })

    // function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
    //   const relativeExceptionPath = path.relative(absoluteFromPath, absoluteExceptionPath)

    //   return importType(relativeExceptionPath, context) !== "parent"
    // }

    // function reportInvalidExceptionPath(node) {
    //   context.report({
    //     node,
    //     message: "Restricted path exceptions must be descendants of the configured `from` path for that zone.",
    //   })
    // }

    function checkForRestrictedImportPath(importPath, node) {
      // const absoluteImportPath = resolve(importPath, context)

      // if (!absoluteImportPath) {
      //   return
      // }

      // matchingZones.forEach((zone) => {
      //   const exceptionPaths = zone.except || []
      //   const absoluteFrom = path.resolve(basePath, zone.from)

      //   if (!containsPath(absoluteImportPath, absoluteFrom)) {
      //     return
      //   }

      //   const absoluteExceptionPaths = exceptionPaths.map((exceptionPath) =>
      //     path.resolve(absoluteFrom, exceptionPath)
      //   )
      //   const hasValidExceptionPaths = absoluteExceptionPaths
      //     .every((absoluteExceptionPath) => isValidExceptionPath(absoluteFrom, absoluteExceptionPath))

      //   if (!hasValidExceptionPaths) {
      //     reportInvalidExceptionPath(node)
      //     return
      //   }

      //   const pathIsExcepted = absoluteExceptionPaths
      //     .some((absoluteExceptionPath) => containsPath(absoluteImportPath, absoluteExceptionPath))

      //   if (pathIsExcepted) {
      //     return
      //   }

      //   context.report({
      //     node,
      //     message: `Unexpected path "{{importPath}}" imported in restricted zone.`,
      //     data: { importPath },
      //   })
      // })
    }

    return {
      ImportDeclaration(node) {
        checkForRestrictedImportPath(node.source.value, node.source)
      },
      CallExpression(node) {
        if (isStaticRequire(node)) {
          const [ firstArgument ] = node.arguments

          checkForRestrictedImportPath(firstArgument.value, firstArgument)
        }
      },
    }
  },
}