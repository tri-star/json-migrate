import { describe, test, vi, expect } from 'vitest'
import { type PerDocumentMigrationDefinition } from '@/domain/migration-definition'
import { runPerDocumentVersionedMigration } from '@/services/per-document-evrsioned-migration'

describe('Operation with a single migration definition', () => {
  test('That commit is called when the migration definition has been successfully processed.', async () => {
    // Given
    const definition: PerDocumentMigrationDefinition = {
      type: 'per_document',
      version: 2,
      getDocuments: async () => {
        return await new Promise((resolve) => {
          resolve([
            { version: 1, id: '1', name: 'name1' },
            { version: 1, id: '2', name: 'name2' },
          ])
        })
      },
      migrate: async (document) => {
        return await new Promise((resolve) => {
          resolve({
            ...document,
            age: 20,
          })
        })
      },
      commit: vi.fn(),
      rollback: vi.fn(),
    }
    const definitions = [definition]
    // When
    await runPerDocumentVersionedMigration(definitions)
    // Then
    expect(definition.commit).toHaveBeenCalledTimes(2)
    expect(definition.rollback).toHaveBeenCalledTimes(0)
    expect(definition.commit).toHaveBeenCalledWith({
      version: 2,
      id: '1',
      name: 'name1',
      age: 20,
    })
    expect(definition.commit).toHaveBeenCalledWith({
      version: 2,
      id: '2',
      name: 'name2',
      age: 20,
    })
  })

  test('That commit is not called when an error occured during migration.', async () => {
    // Given
    const definition: PerDocumentMigrationDefinition = {
      type: 'per_document',
      version: 2,
      getDocuments: async () => {
        return await new Promise((resolve) => {
          resolve([
            { version: 1, id: '1', tags: [] },
            { version: 1, id: '2', tags: undefined }, // Error
          ])
        })
      },
      migrate: async (document) => {
        return await new Promise((resolve) => {
          resolve({
            ...document,
            tags: [...(document.tags as string[]), 'new-tag'],
          })
        })
      },
      commit: vi.fn(),
      rollback: vi.fn(),
    }
    const definitions = [definition]
    // When
    await expect(runPerDocumentVersionedMigration(definitions)).rejects.toThrowError(/^migration verification failed:/)
    // Then
    // since the migration is divided into verification phase and commit phase,
    // If an error occurs during the verification phase, commit and rollback is simply not called.
    expect(definition.commit).toHaveBeenCalledTimes(0)
    expect(definition.rollback).toHaveBeenCalledTimes(0)
  })
})
