type UnknownObject = Record<string, unknown>

export type VersionedDocument = {
  version?: number
  [key: string]: unknown
}

export type PerDocumentMigrationDefinition = {
  type: 'per_document'
  version: number
  migrate: (document: UnknownObject) => UnknownObject | Promise<UnknownObject>
}

export type MigrationDefinition = { type: 'centerized' } | PerDocumentMigrationDefinition

export type VersionStrategy = MigrationDefinition['type']
