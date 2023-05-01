import { runPerDocumentVersionedMigration } from "../../services/per-document-evrsioned-migration";
import { MigrationDefinition, PerDocumentMigrationDefinition, VersionStrategy } from "../../domain/migration-definition";

export async function migrate(strategy: VersionStrategy, definitions: MigrationDefinition[]) {
  if(strategy === "per_document") {
    await runPerDocumentVersionedMigration(definitions as PerDocumentMigrationDefinition[])
  }
}
