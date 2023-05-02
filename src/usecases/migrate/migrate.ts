import { runPerDocumentVersionedMigration } from '../../services/per-document-evrsioned-migration'
import {
  type MigrationDefinition,
  type PerDocumentMigrationDefinition,
  type VersionStrategy,
} from '../../domain/migration-definition'

export async function migrate(strategy: VersionStrategy, definitions: MigrationDefinition[]): Promise<void> {
  if (strategy === 'per_document') {
    await runPerDocumentVersionedMigration(definitions as PerDocumentMigrationDefinition[])
  }
}
