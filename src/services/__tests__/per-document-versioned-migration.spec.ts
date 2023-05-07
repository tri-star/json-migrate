import { describe, test, vi, expect } from 'vitest'
import { type VersionedDocument, type PerDocumentMigrationDefinition } from '@/domain/migration-definition'
import { runPerDocumentVersionedMigration } from '@/services/per-document-evrsioned-migration'

describe('Operation with a single migration definition', () => {
  test('That commit is called when the migration definition has been successfully processed.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }

    const definition: PerDocumentMigrationDefinition = {
      type: 'per_document',
      version: 2,
      getDocument: () => initialDocument,
      migrate: (document) => {
        return {
          ...document,
          fontSize: 20,
        }
      },
      commit: vi.fn(),
    }
    const definitions = [definition]
    // When
    await runPerDocumentVersionedMigration(definitions)
    // Then
    expect(definition.commit).toHaveBeenCalledTimes(1)
    expect(definition.commit).toHaveBeenCalledWith({
      version: 2,
      color: 'red',
      fontSize: 20,
    })
  })

  test('That commit is not called when an error occured during migration.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }
    const definition: PerDocumentMigrationDefinition = {
      type: 'per_document',
      version: 2,
      getDocument: () => initialDocument,
      migrate: (document) => {
        return {
          ...document,
          menuItems: [...(document.menuItems as string[]), 'new-item'], // Error: menuItems is undefined
        }
      },
      commit: vi.fn(),
    }
    const definitions = [definition]
    // When
    await expect(runPerDocumentVersionedMigration(definitions)).rejects.toThrowError(
      /^migration error: TypeError: document.menuItems is not iterable/
    )
    // Then
    // since the migration is divided into verification phase and commit phase,
    // If an error occurs during the verification phase, commit and rollback is simply not called.
    expect(definition.commit).toHaveBeenCalledTimes(0)
  })
})
