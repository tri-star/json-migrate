type UnknownObject = Record<string, unknown>

export type VersionedDocument = {
  version?: number
  [key: string]: unknown
}

export type PerDocumentMigrationDefinition = {
  type: 'per_document'
  version: number
  getDocument: () => VersionedDocument | Promise<VersionedDocument>
  migrate: (document: UnknownObject) => UnknownObject | Promise<UnknownObject>
  commit: (VersionedDocument: VersionedDocument) => void | Promise<void>
}

export type MigrationDefinition = { type: 'centerized' } | PerDocumentMigrationDefinition

export type VersionStrategy = MigrationDefinition['type']
