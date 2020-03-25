import path from "path"

//export const FILENAME = testFilePath('foo.js')

export function testFilePath(relativePath) {
  return path.join(process.cwd(), "tests", relativePath)
}

export function test<T>(t: T) {
  return {
    ...t,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6
    }
  }
}

export function message(msg, keys) {
  for (const key of Object.keys(keys)) {
    msg = msg.replace(`{{${key}}}`, keys[key])
  }

  return msg
}