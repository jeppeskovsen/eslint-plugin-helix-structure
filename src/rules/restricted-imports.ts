import { getLayerAndModuleName } from "../utils/helix"
import { Rule } from "eslint"
import path from "path"
import { isStaticRequire } from "../utils/static-require"
import { getAbsolutePath } from "../utils/path-fixer"

export const messages = {
  featureIntoFeature: "Unexpected path '{{importPath}}'. Cannot import Feature into another Feature.",
  projectIntoFeature: "Unexpected path '{{importPath}}'. Cannot import Project into a Feature.",
  featureIntoFoundation: "Unexpected path '{{importPath}}'. Cannot import Feature into Foundation.",
  projectIntoFoundation: "Unexpected path '{{importPath}}'. Cannot import Project into Foundation.",
  projectIntoProject: "Unexpected path '{{importPath}}'. Cannot import Project into another Project."
}

interface RuleOptions {
  basePath: string
}

export default {
  meta: {
    type: "problem",
    docs: {
      url: "https://github.com/jeppeskovsen/eslint-plugin-helix-structure",
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
    const options: RuleOptions = context.options[0] || {}
    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)
    const absoluteCurrentFile = context.getFilename()
    const absoluteCurrentPath = path.dirname(absoluteCurrentFile)

    function checkForRestrictedImportPath(importPath: string, node: any) {
      const absoluteImportPath = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)
      if (!absoluteImportPath) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentPath, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportPath, absoluteBasePath)
      if (!importLayerName || !importModuleName) return

      if (currentLayerName === "feature" && importLayerName === "feature" && currentModuleName !== importModuleName) {
        context.report({
          node,
          message: messages.featureIntoFeature,
          data: { importPath },
        })
      }

      if (currentLayerName === "feature" && importLayerName === "project") {
        context.report({
          node,
          message: messages.projectIntoFeature,
          data: { importPath },
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "feature") {
        context.report({
          node,
          message: messages.featureIntoFoundation,
          data: { importPath },
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "project") {
        context.report({
          node,
          message: messages.projectIntoFoundation,
          data: { importPath },
        })
      }

      if (currentLayerName === "project" && importLayerName === "project" && currentModuleName !== importModuleName) {
        context.report({
          node,
          message: messages.projectIntoProject,
          data: { importPath },
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