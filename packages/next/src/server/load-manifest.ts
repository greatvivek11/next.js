import { readFileSync } from 'fs'
import { runInNewContext } from 'vm'
import { freeze } from './lib/freeze'

const cache = new Map<string, unknown>()

export function loadManifest(
  path: string,
  shouldCache: boolean = true
): unknown {
  const cached = shouldCache && cache.get(path)
  if (cached) {
    return cached
  }

  const manifest = JSON.parse(readFileSync(path, 'utf8'))

  // Freeze the manifest so it cannot be modified if we're caching it.
  if (shouldCache) {
    freeze(manifest)
  }

  if (shouldCache) {
    cache.set(path, manifest)
  }

  return manifest
}

export function evalManifest(
  path: string,
  shouldCache: boolean = true
): unknown {
  const cached = shouldCache && cache.get(path)
  if (cached) {
    return cached
  }

  const content = readFileSync(path, 'utf8')
  if (content.length === 0) {
    throw new Error('Manifest file is empty')
  }

  const contextObject = {}
  runInNewContext(content, contextObject)

  // Freeze the context object so it cannot be modified if we're caching it.
  if (shouldCache) {
    freeze(contextObject)
  }

  if (shouldCache) {
    cache.set(path, contextObject)
  }

  return contextObject
}

export function clearManifestCache(path: string): boolean {
  return cache.delete(path)
}
