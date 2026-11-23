import { createHash, randomUUID } from 'node:crypto'

import { MemoryStore } from '../dist/index.mjs'

export function fixture() {
  const files = new Map(),
    manifests = new Map()
  const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
  const storage = {
    list: async () => [...files.keys()].sort(),
    read: async (path) => files.get(path)?.slice() ?? null,
    identity: async (path) => path,
    async replace(path, expected, bytes, check) {
      check()
      if ((files.has(path) ? sha256(files.get(path)) : null) !== expected) throw Error('stale')
      if (bytes === null) files.delete(path)
      else files.set(path, bytes.slice())
    }
  }
  const backup = {
    now: Date.now,
    createId: randomUUID,
    sha256,
    list: async () => [...manifests.keys()],
    read: async (path) => manifests.get(path)?.slice() ?? null,
    write: async (path, bytes) => {
      manifests.set(path, bytes.slice())
    },
    remove: async (path) => {
      manifests.delete(path)
    }
  }
  const access = { assertAuthorized() {} }
  const approve = async () => () => undefined
  return { files, storage, backup, access, approve, store: new MemoryStore(storage, backup) }
}
