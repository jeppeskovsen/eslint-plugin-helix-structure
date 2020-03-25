import { getLayerAndModuleName } from "./helix"
import { assert } from "chai"

describe("utils/helix tests", () => {
  it("returns correct layer and module", () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner", "C:\\test\\src")
    
    assert.equal(layer, "feature")
    assert.equal(module, "banner")
  })

  it("returns correct layer and module deep", () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner\\subfolder\\subfolder\\subfolder\\subfolder", "C:\\test\\src")
    
    assert.equal(layer, "feature")
    assert.equal(module, "banner")
  })

  it("returns null without breaking", () => {
    const [layer, module] = getLayerAndModuleName("C:\\invalid path", "C\\invalid")

    assert.equal(layer, null)
    assert.equal(module, null)
  })
})