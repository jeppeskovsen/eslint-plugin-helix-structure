import { getLayerAndModuleName } from "../utils/helix"
import { Rule } from "eslint"
import path from "path"
import { isStaticRequire } from "../utils/static-require"
import resolve from "eslint-module-utils/resolve"

export default {
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

  create: function noRestrictedPaths(context: any) {
    const options = context.options[0] || {}
    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)
    const absoluteCurrentPath = context.getFilename()

    function checkForRestrictedImportPath(importPath: string, node: any) {
      const absoluteImportPath: string = resolve(importPath, context)
      if (!absoluteImportPath) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentPath, absoluteBasePath);
      if (!currentLayerName || !currentModuleName) return;

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportPath, absoluteBasePath);
      if (!importLayerName || !importModuleName) return;

      if (currentLayerName === "feature" && importLayerName === "feature" && currentModuleName !== importModuleName) {
        context.report({
          node,
          message: "Unexpected path '{{importPath}}'. Cannot import {{currentLayerName}} into a another {{importLayerName}}.",
          data: { importPath, currentLayerName, importLayerName },
        })
      }

      if (currentLayerName === "feature" && importLayerName === "project") {
        context.report({
          node,
          message: "Unexpected path '{{importPath}}'. Cannot import {{importLayerName}} into a {{currentLayerName}}.",
          data: { importPath, currentLayerName, importLayerName },
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "feature" || importLayerName === "project") {
        context.report({
          node,
          message: "Unexpected path '{{importPath}}'. Cannot import {{importLayerName}} into {{currentLayerName}}.",
          data: { importPath, currentLayerName, importLayerName },
        })
      }
    }

    return {
      ImportDeclaration(node: any) {
        checkForRestrictedImportPath(node.source.value, node.source)
      },
      CallExpression(node: any) {
        if (isStaticRequire(node)) {
          const [ firstArgument ] = node.arguments

          checkForRestrictedImportPath(firstArgument.value, firstArgument)
        }
      },
    }
  },
} as Rule.RuleModule