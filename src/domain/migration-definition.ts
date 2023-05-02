type BackupDefinition = {
  key: string
  restore: (document: unknown) => Promise<void> | void
}

type UnknownObject = Record<string, unknown>

export type VersionedDocument = {
  version: number
  [key: string]: unknown
}

export type PerDocumentMigrationDefinition = {
  type: 'per_document'
  backup?: BackupDefinition
  version: number
  getDocuments: () => Promise<VersionedDocument[]>
  migrate: (document: UnknownObject) => Promise<UnknownObject>
  commit: (VersionedDocument: VersionedDocument) => Promise<void>
  rollback: (document: UnknownObject) => Promise<void>
}

export type MigrationDefinition = { type: 'centerized' } | PerDocumentMigrationDefinition

export type VersionStrategy = MigrationDefinition['type']
