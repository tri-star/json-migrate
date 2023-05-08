import { type MigrationDefinition, type VersionedDocument } from './domain/migration-definition.js'
import { runPerDocumentVersionedMigration } from './services/per-document-versioned-migration.js'

export type { MigrationDefinition, VersionedDocument }

export async function migrate(
  document: VersionedDocument,
  definitions: MigrationDefinition[]
): Promise<VersionedDocument> {
  return await runPerDocumentVersionedMigration(document, definitions)
}
