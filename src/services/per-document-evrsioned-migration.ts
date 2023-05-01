import { PerDocumentMigrationDefinition } from "../domain/migration-definition";


export async function runPerDocumentVersionedMigration(definitions: PerDocumentMigrationDefinition[])
{
  try {
    for(const definition of definitions ) {
      await verify(definition)
    }
  } catch(e) {
    // TODO: どのdefinitionでエラーになったか、どのドキュメントでエラーになったかを返す
    // サービス専用のエラーをthrowする
    throw new Error('migration verification failed: ' + e.message)
  }

  try {
    for(const definition of definitions ) {
      await migrate(definition)
    }
  } catch(e) {
    // TODO: どのdefinitionでエラーになったか、どのドキュメントでエラーになったかを返す
    // サービス専用のエラーをthrowする
    throw new Error('migration error: ' + e.message)
  }
}

async function verify(definition: PerDocumentMigrationDefinition) {
  const documents = await definition.getDocuments()
  for(const document of documents) {
    await definition.migrate(document)
  }
}


async function migrate(definition: PerDocumentMigrationDefinition) {
  const documents = await definition.getDocuments()
  for(const document of documents) {
    const migratedDocument = await definition.migrate(document)

    await definition.commit({
      version: definition.version,
      ...migratedDocument
    })
  }
}
