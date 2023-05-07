import { unwrapPromise } from '@/lib/promise'
import { type PerDocumentMigrationDefinition } from '../domain/migration-definition'

export async function runPerDocumentVersionedMigration(definitions: PerDocumentMigrationDefinition[]): Promise<void> {
  try {
    for (const definition of definitions) {
      await migrate(definition)
    }
  } catch (e) {
    // TODO: どのdefinitionでエラーになったか、どのドキュメントでエラーになったかを返す
    // サービス専用のエラーをthrowする
    throw new Error(`migration error: ${e as string}`)
  }
}

async function migrate(definition: PerDocumentMigrationDefinition): Promise<void> {
  const document = await unwrapPromise(definition.getDocument())
  const migratedDocument = await unwrapPromise(definition.migrate(document))

  await definition.commit({
    ...migratedDocument,
    version: definition.version,
  })
}
