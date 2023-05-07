import { type MigrationDefinition, type VersionedDocument } from './domain/migration-definition'
import { runPerDocumentVersionedMigration } from './services/per-document-versioned-migration'

export async function migrate(
  document: VersionedDocument,
  definitions: MigrationDefinition[]
): Promise<VersionedDocument> {
  return await runPerDocumentVersionedMigration(document, definitions)
}
