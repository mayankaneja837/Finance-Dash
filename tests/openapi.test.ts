import { describe, expect, it } from 'vitest'
import { openApiDocument } from '../src/docs/openapi'

describe('OpenAPI document', () => {
  it('defines responses for every documented operation', () => {
    for (const pathItem of Object.values(openApiDocument.paths)) {
      for (const operation of Object.values(pathItem)) {
        expect(operation).toHaveProperty('responses')
      }
    }
  })

  it('documents the self-update forbidden case for PATCH /user/{id}', () => {
    const patchOperation = openApiDocument.paths['/user/{id}'].patch

    expect(patchOperation.responses).toHaveProperty('403')
    expect(patchOperation.responses['403'].description).toContain('Insufficient permissions')
  })
})
