import { describe, it, expect } from "vitest"

describe("App Configuration", () => {
  it("should have a valid configuration", () => {
    // Test basique pour s'assurer que l'environnement de test fonctionne
    expect(true).toBe(true)
  })

  it("should load environment variables", () => {
    // Test pour vérifier que l'environnement est correctement configuré
    expect(import.meta.env).toBeDefined()
  })
})
