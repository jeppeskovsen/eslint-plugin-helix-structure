import * as ESTree from 'estree'
import { getLayerAndModuleName } from "../utils/helix"
import { relativeToTilde, tildeToRelative, getAbsolutePath } from "../utils/path-fixer"
import { Rule } from "eslint"
import path from "path"
import { isStaticRequire } from "../utils/static-require"

export const messages = {
  useTilde: "Unexpected path '{{importPath}}', use tilde (~/{{importLayerName}}) import paths when it's from a different layer than {{currentLayerName}}.",
  useRelative: "Unexpected path '{{importPath}}', use relative import paths within the same module ({{moduleName}})."
}


export default {
  meta: {
    type: 'problem',
    docs: {
      url: "todo",
    },
    fixable: "code",
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

  create: (context) => {
    const options = context.options[0] || {}
    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)
    const absoluteCurrentFile = context.getFilename()
    const absoluteCurrentPath = path.dirname(absoluteCurrentFile)

    function checkForRestrictedTildeImport(importPath: string, node: ESTree.Node) {
      const parentNode: ESTree.Node = (node as any).parent;

      const absoluteImportPath: string = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)
      if (!absoluteImportPath) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath);
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportPath, absoluteBasePath);
      if (!importLayerName || !importModuleName) return

      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {
        if (importPath.startsWith("~/")) {
          context.report({
            node,
            message: messages.useRelative,
            data: { importPath, moduleName: currentModuleName },
            fix(fixer) {
              const sourceCode = context.getSourceCode().text
              const newSourceCode = sourceCode.replace(importPath, tildeToRelative(absoluteBasePath, absoluteCurrentPath, importPath))
              return fixer.replaceTextRange([parentNode.loc.start.column, parentNode.loc.end.column], newSourceCode);
            }
          })
        }

        return
      }

      if (!importPath.startsWith("~/")) {
        context.report({
          node,
          message: messages.useTilde,
          data: { importPath, importLayerName, currentLayerName },
          fix(fixer) {
            const sourceCode = context.getSourceCode().text
            const newSourceCode = sourceCode.replace(importPath, relativeToTilde(absoluteBasePath, absoluteCurrentPath, importPath))
            return fixer.replaceTextRange([parentNode.loc.start.column, parentNode.loc.end.column], newSourceCode);
          }
        })
      }
    }

    return {
      ImportDeclaration(node: ESTree.ImportDeclaration) {
        const source = node.source
        checkForRestrictedTildeImport(source.value as string, source)
      },
      CallExpression(node: ESTree.CallExpression) {
        if (isStaticRequire(node)) {
          const [source] = node.arguments
          checkForRestrictedTildeImport((source as any).value, source)
        }
      }
    }
  }
} as Rule.RuleModule