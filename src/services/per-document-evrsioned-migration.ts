import { type PerDocumentMigrationDefinition } from '../domain/migration-definition'

export async function runPerDocumentVersionedMigration(definitions: PerDocumentMigrationDefinition[]): Promise<void> {
  try {
    for (const definition of definitions) {
      await verify(definition)
    }
  } catch (e) {
    // TODO: どのdefinitionでエラーになったか、どのドキュメントでエラーになったかを返す
    // サービス専用のエラーをthrowする
    throw new Error(`migration verification failed: ${e as string}`)
  }

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

async function verify(definition: PerDocumentMigrationDefinition): Promise<void> {
  const documents = await definition.getDocuments()
  for (const document of documents) {
    await definition.migrate(document)
  }
}

async function migrate(definition: PerDocumentMigrationDefinition): Promise<void> {
  const documents = await definition.getDocuments()
  for (const document of documents) {
    const migratedDocument = await definition.migrate(document)

    await definition.commit({
      version: definition.version,
      ...migratedDocument,
    })
  }
}
