import { unwrapPromise } from '../lib/promise.js'
import { type VersionedDocument, type MigrationDefinition } from '../domain/migration-definition.js'

export async function runPerDocumentVersionedMigration(
  document: VersionedDocument,
  definitions: MigrationDefinition[]
): Promise<VersionedDocument> {
  let pendingDocument = document
  try {
    for (const definition of definitions) {
      if ((document.version ?? 0) >= definition.version) {
        continue
      }
      pendingDocument = await migrate(pendingDocument, definition)
    }
  } catch (e) {
    // TODO: どのdefinitionでエラーになったか、どのドキュメントでエラーになったかを返す
    // サービス専用のエラーをthrowする
    throw new Error(`migration error: ${e as string}`)
  }
  return pendingDocument
}

async function migrate(document: VersionedDocument, definition: MigrationDefinition): Promise<VersionedDocument> {
  const migratedDocument = await unwrapPromise(definition.migrate(document))

  return {
    ...migratedDocument,
    version: definition.version,
  }
}
