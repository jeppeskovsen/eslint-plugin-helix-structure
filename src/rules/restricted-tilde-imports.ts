import { getLayerAndModuleName } from "../utils/helix"
import { Rule } from "eslint"
import path from "path"
import { isStaticRequire } from "../utils/static-require"
import resolve from "eslint-module-utils/resolve"

export default {
  meta: {
    type: 'problem',
    docs: {
      url: "todo",
    },
    schema: [
      {
        type: "object",
        properties: {
          basePath: { type: "string" },
        },
        additionalProperties: false
      }
    ]
  },

  create: (context: any) => {
    const options = context.options[0] || {}
    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)
    const absoluteCurrentPath = context.getFilename()

    function checkForRestrictedTildeImport(importPath: string, node: any) {
      const absoluteImportPath: string = resolve(importPath, context)
      if (!absoluteImportPath) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentPath, absoluteBasePath);
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportPath, absoluteBasePath);
      if (!importLayerName || !importModuleName) return

      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {
        if (importPath.startsWith("~/")) {
          context.report({
            node,
            message: "Unexpected path '{{importPath}}', use relative import paths within the same module ({{moduleName}}).",
            data: { importPath, moduleName: currentModuleName },
          })
        }

        return
      }

      if (!importPath.startsWith("~/")) {
        context.report({
          node,
          message: "Unexpected path '{{importPath}}', use tilde (~/{{importLayerName}}) import paths when it's from a different layer than {{currentLayerName}}.",
          data: { importPath, importLayerName, currentLayerName },
        })
      }
    }

    return {
      ImportDeclaration(node: any) {
        checkForRestrictedTildeImport(node.source.value, node.source)
      },
      CallExpression(node: any) {
        if (isStaticRequire(node)) {
          const [ firstArgument ] = node.arguments
          checkForRestrictedTildeImport(firstArgument.value, firstArgument)
        }
      }
    }
  }
} as Rule.RuleModule