import { describe, test, vi, expect } from 'vitest'
import { type PerDocumentMigrationDefinition } from '@/domain/migration-definition'
import { runPerDocumentVersionedMigration } from '@/services/per-document-evrsioned-migration'

describe('Operation with a single migration definition', () => {
  test('That commit is called when the migration definition has been successfully processed.', async () => {
    // Given
    const definition: PerDocumentMigrationDefinition = {
      type: 'per_document',
      version: 2,
      getDocuments: vi.fn().mockResolvedValue([
        { id: '1', name: 'name1' },
        { id: '2', name: 'name2' },
      ]),
      migrate: vi
        .fn()
        .mockResolvedValue(undefined)
        .mockResolvedValueOnce({ name: 'name1', age: 20 }) // For verification phase
        .mockResolvedValueOnce({ name: 'name2', age: 21 })
        .mockResolvedValueOnce({ name: 'name1', age: 20 }) // For migration phase
        .mockResolvedValueOnce({ name: 'name2', age: 21 }),
      commit: vi.fn(),
      rollback: vi.fn(),
    }
    const definitions = [definition]
    // When
    await runPerDocumentVersionedMigration(definitions)
    // Thena
    expect(definition.commit).toHaveBeenCalledTimes(2)
    expect(definition.commit).toHaveBeenCalledWith({
      version: 2,
      name: 'name1',
      age: 20,
    })
    expect(definition.commit).toHaveBeenCalledWith({
      version: 2,
      name: 'name2',
      age: 21,
    })
  })
})
