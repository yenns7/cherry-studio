export interface MemoryClock {
  now(): number
  createId(): string
  /** Lowercase hex SHA-256 over the exact bytes. */
  sha256(bytes: Uint8Array): string
}

export interface MemoryStorage {
  list(): Promise<string[]>
  read(path: string): Promise<Uint8Array | null>
  /** Stable physical identity; canonical names also distinguish missing targets. */
  identity(path: string): Promise<string>
  /** Compare bytes and check authorization in the host's final replacement operation. */
  replace(path: string, expectedHash: string | null, bytes: Uint8Array | null, check: () => void): Promise<void>
}

export interface MemoryBackupStorage extends MemoryClock {
  list(): Promise<string[]>
  read(path: string): Promise<Uint8Array | null>
  write(path: string, bytes: Uint8Array): Promise<void>
  remove(path: string): Promise<void>
}

export function digest(clock: MemoryClock, bytes: Uint8Array): string
export function digest(clock: MemoryClock, bytes: null): null
export function digest(clock: MemoryClock, bytes: Uint8Array | null): string | null
export function digest(clock: MemoryClock, bytes: Uint8Array | null): string | null {
  return bytes === null ? null : clock.sha256(bytes)
}
