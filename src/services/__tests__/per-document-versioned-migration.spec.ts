import { describe, test, expect, vi } from 'vitest'
import { type VersionedDocument, type MigrationDefinition } from '@/domain/migration-definition'
import { runPerDocumentVersionedMigration } from '@/services/per-document-versioned-migration'

describe('Operation with a single migration definition', () => {
  test('That migration applied when the migration definition has been successfully processed.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }

    const definition: MigrationDefinition = {
      version: 2,
      migrate: (document) => {
        return {
          ...document,
          fontSize: 20,
        }
      },
    }
    const definitions = [definition]
    // When
    const migratedDocument = await runPerDocumentVersionedMigration(initialDocument, definitions)
    // Then
    expect(migratedDocument).toEqual({
      version: 2,
      color: 'red',
      fontSize: 20,
    })
  })

  test('That migration aborted when an error occured during migration.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }
    const definition: MigrationDefinition = {
      version: 2,
      migrate: (document) => {
        return {
          ...document,
          menuItems: [...(document.menuItems as string[]), 'new-item'], // Error: menuItems is undefined
        }
      },
    }
    const definitions = [definition]
    // When
    // Then
    await expect(runPerDocumentVersionedMigration(initialDocument, definitions)).rejects.toThrowError(
      /^migration error: TypeError: document.menuItems is not iterable/
    )
  })
})

describe('Operation with a multiple migration definition', () => {
  test('That all migration applied when all migration definition has been successfully processed.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }

    const definitions: MigrationDefinition[] = [
      {
        version: 2,
        migrate: (document) => {
          return {
            ...document,
            fontSize: 20,
          }
        },
      },
      {
        version: 3,
        migrate: (document) => {
          return {
            ...document,
            showToolBar: false,
          }
        },
      },
    ]
    // When
    const migratedDocument = await runPerDocumentVersionedMigration(initialDocument, definitions)
    // Then
    expect(migratedDocument).toEqual({
      version: 3,
      color: 'red',
      fontSize: 20,
      showToolBar: false,
    })
  })

  test('Versions older than the document itself should be skipped.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 2,
      color: 'red',
    }

    const spy = vi.fn()
    const definitions: MigrationDefinition[] = [
      {
        version: 1,
        migrate: (document) => {
          spy()
          return document
        },
      },
      {
        version: 2,
        migrate: (document) => {
          spy()
          return document
        },
      },
      {
        version: 3,
        migrate: (document) => {
          return {
            ...document,
            showToolBar: false,
          }
        },
      },
    ]
    // When
    const migratedDocument = await runPerDocumentVersionedMigration(initialDocument, definitions)
    // Then
    expect(migratedDocument).toEqual({
      version: 3,
      color: 'red',
      showToolBar: false,
    })
    expect(spy).toHaveBeenCalledTimes(0)
  })

  test('That migration aborted when an error occured during migration.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      version: 1,
      color: 'red',
    }
    const spy = vi.fn()
    const definitions: MigrationDefinition[] = [
      {
        version: 2,
        migrate: (document) => {
          return {
            ...document,
            menuItems: [...(document.menuItems as string[]), 'new-item'], // Error: menuItems is undefined
          }
        },
      },
      {
        version: 3,
        migrate: (document) => {
          spy()
          return document
        },
      },
    ]
    // When
    await expect(runPerDocumentVersionedMigration(initialDocument, definitions)).rejects.toThrowError(
      /^migration error: TypeError: document.menuItems is not iterable/
    )
    // Then
    expect(spy).toHaveBeenCalledTimes(0)
  })
})

describe('Documentation without version', () => {
  test('it must be possible to perform the migration as version 1.', async () => {
    // Given
    const initialDocument: VersionedDocument = {
      color: 'red',
    }
    const definition: MigrationDefinition = {
      version: 1,
      migrate: (document) => {
        return {
          ...document,
          fontSize: 20,
        }
      },
    }
    const definitions = [definition]
    // When
    const migratedDocument = await runPerDocumentVersionedMigration(initialDocument, definitions)
    // Then
    expect(migratedDocument).toEqual({
      version: 1,
      color: 'red',
      fontSize: 20,
    })
  })
})
