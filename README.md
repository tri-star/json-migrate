# @tri-star/json-migrate

## Description

A JSON migration tool that handles client side JSON migration(e.g. setting stored in LocalStorage)

## Installation

```sh
npm install @tri-star/json-migrate
```

## Usage

```ts
import { migrate } from '@tri-star/json-migrate'
import { type MigrationDefinition, type VersionedDocument } from '@tri-star/json-migrate'

const initialDocument = {
  // The 'version' field is taken as the current version of the document(must be number).
  // If omitted, it is treated as version 1.
  version: 1,
  color: 'red',
}

// Migration definition.
const definitions: MigrationDefinition[] = [
  {
    version: 2,
    migrate: (document: VersionedDocument) => {
      return {
        ...document,
        fontSize: 20,
      }
    },
  },
  {
    version: 3,
    // async function also supported.
    migrate: async (document: VersionedDocument) => {
      return await new Promise((resolve) =>
        resolve({
          ...document,
          showMenu: false,
        })
      )
    },
  },
]

try {
  const migratedDocument = await migrate(initialDocument, definitions)
  console.log(migratedDocument)
  // {
  //   version: 3,
  //   color: 'red',
  //   fontSize: 20,
  //   showMenu: false,
  // }
} catch (e) {
  if (e instanceof Error) {
    // Currently, an error is simply thrown as an Error instance.
    console.error(e)
  }
}
```

## Contributing

TODO

## Road map

- Add CLI tool
  - [ ] Make migration file.
  - [ ] Version integrity check for specified folders.
