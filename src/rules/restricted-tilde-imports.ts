import * as ESTree from 'estree'
import { getLayerAndModuleName } from "../utils/helix"
import { relativeToTilde, tildeToRelative, getAbsolutePath } from "../utils/path-fixer"
import { AST, Rule } from "eslint"
import path from "path"
import { isStaticRequire } from "../utils/static-require"
import resolve from "eslint-module-utils/resolve"

export const messages = {
  useTilde: "Unexpected path '{{importPath}}', use tilde (~/{{importLayerName}}) import paths when it's from a different layer than {{currentLayerName}}.",
  useRelative: "Unexpected path '{{importPath}}', use relative import paths within the same module ({{moduleName}})."
}

interface RuleOptions {
  basePath: string
  ignoreFix: boolean
}

export default {
  meta: {
    type: 'problem',
    docs: {
      url: "https://github.com/jeppeskovsen/eslint-plugin-helix-structure",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          basePath: { type: "string" },
          ignoreFix: { type: "boolean" }
        },
        additionalProperties: false
      }
    ]
  },

  create: function restrictedTildeImports(context) {
    const options: RuleOptions = context.options[0] || {}
    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)
    const absoluteCurrentFile = context.getFilename()
    const absoluteCurrentPath = path.dirname(absoluteCurrentFile)

    function checkForRestrictedTildeImport(importPath: string, node: ESTree.Node) {
      const parentNode: ESTree.ImportDeclaration = (node as any).parent

      const absoluteImportPath = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)
      if (!absoluteImportPath) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportPath, absoluteBasePath)
      if (!importLayerName || !importModuleName) return

      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {
        if (importPath.startsWith("~/")) {
          context.report({
            node,
            message: messages.useRelative,
            data: { importPath, moduleName: currentModuleName },
            fix(fixer) {
              if (options.ignoreFix) {
                return
              }

              const newImport = tildeToRelative(absoluteBasePath, absoluteCurrentPath, importPath)
              
              const [rangeFrom, rangeTo] = parentNode.source.range
              const range: AST.Range = [rangeFrom + 1, rangeTo - 1] // to avoid getting "" (quotes)
  
              return fixer.replaceTextRange(range, newImport)
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
            if (options.ignoreFix) {
              return
            }

            const newImport =  relativeToTilde(absoluteBasePath, absoluteCurrentPath, importPath)

            const [rangeFrom, rangeTo] = parentNode.source.range
            const range: AST.Range = [rangeFrom + 1, rangeTo - 1] // to avoid getting "" (quotes)

            return fixer.replaceTextRange(range, newImport)
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