import path from "path"

//export const FILENAME = testFilePath('foo.js')

export function testFilePath(relativePath) {
  return path.join(process.cwd(), "tests", relativePath)
}

export function test(t) {
  return {
    ...t,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ...t.parserOptions,
    }
  }
}