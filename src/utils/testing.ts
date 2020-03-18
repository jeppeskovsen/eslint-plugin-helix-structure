import path from "path"

export const FILENAME = testFilePath('foo.js')

export function testFilePath(relativePath) {
  return path.join(process.cwd(), '../files', relativePath)
}

export function test(t) {
  return Object.assign({
    filename: FILENAME,
  }, t, {
    parserOptions: Object.assign({
      sourceType: 'module',
      ecmaVersion: 6,
    }, t.parserOptions),
  })
}