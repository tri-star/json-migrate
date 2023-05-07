type UnknownObject = Record<string, unknown>

export type VersionedDocument = {
  version?: number
  [key: string]: unknown
}

export type MigrationDefinition = {
  version: number
  migrate: (document: UnknownObject) => UnknownObject | Promise<UnknownObject>
}
