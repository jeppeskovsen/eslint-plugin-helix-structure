import path from "path"
import { relativeToTilde, tildeToRelative, getAbsolutePath } from "./path-fixer"
import { assert } from "chai"

describe("utils/path-fixer tests", () => {
  const basePath = "C:\\project\\src"

  it("converts relative path to tilde", () => {
    const currentPath = path.join(basePath, "utils")
    
    const result1 = relativeToTilde(basePath, currentPath, "../some-folder/some-file")
    const result2 = relativeToTilde(basePath, currentPath, "./some-folder/some-file")
    
    assert.equal(result1, "~/some-folder/some-file")
    assert.equal(result2, "~/utils/some-folder/some-file")
  })

  it("converts tilde path to relative", () => {
    const importPath = "~/some-folder/some-file"
    
    const result1 = tildeToRelative(basePath, path.join(basePath, "utils"), importPath)
    const result2 = tildeToRelative(basePath, basePath, importPath)

    assert.equal(result1, "../some-folder/some-file")
    assert.equal(result2, "./some-folder/some-file")
  })

  it("resolves absolute path", () => {
    const currentPath = path.join(basePath, "utils")
    const expected = "C:\\project\\src\\some-folder\\some-file"

    const result1 = getAbsolutePath(basePath, currentPath, "../some-folder/some-file")    
    const result2 = getAbsolutePath(basePath, currentPath, "~/some-folder/some-file")

    assert.equal(result1, expected)
    assert.equal(result2, expected)
  })
})