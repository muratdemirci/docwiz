/**
 * Postman Collection v2.1 Parser
 * Single Responsibility: Parse Postman v2.1 JSON into structured data.
 * Open/Closed: New collection versions can extend validation without modifying core parsing.
 */

const SUPPORTED_SCHEMA =
  'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'

let idCounter = 0

/**
 * Generate a deterministic, unique ID for items without _postman_id
 */
function generateId(prefix) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

/**
 * Reset ID counter (for testing determinism)
 */
export function resetIdCounter() {
  idCounter = 0
}

/**
 * Validate that the input is a valid Postman v2.1 collection
 */
export function validateCollection(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Geçersiz JSON verisi.' }
  }
  if (!data.info) {
    return { valid: false, error: 'Postman collection "info" alanı bulunamadı.' }
  }
  if (!data.info.name) {
    return { valid: false, error: 'Collection adı bulunamadı.' }
  }
  if (!data.item || !Array.isArray(data.item)) {
    return { valid: false, error: 'Collection "item" dizisi bulunamadı.' }
  }
  if (data.info.schema && data.info.schema !== SUPPORTED_SCHEMA) {
    return {
      valid: false,
      error: `Desteklenmeyen schema: ${data.info.schema}. Sadece v2.1 desteklenmektedir.`,
    }
  }
  return { valid: true, error: null }
}

/**
 * Parse a URL object or string into a readable URL string
 */
export function parseUrl(url) {
  if (!url) return ''
  if (typeof url === 'string') return url
  return url.raw || ''
}

/**
 * Normalize an array of key-value items (headers, query params)
 * DRY: shared logic for headers and query params
 */
function normalizeKeyValueList(items) {
  if (!items || !Array.isArray(items)) return []
  return items.map((item) => ({
    key: item.key || '',
    value: item.value || '',
    description: item.description || '',
    disabled: item.disabled || false,
  }))
}

/**
 * Extract query parameters from a URL object
 */
export function extractQueryParams(url) {
  if (!url || typeof url === 'string') return []
  return normalizeKeyValueList(url.query)
}

/**
 * Parse request headers
 */
export function parseHeaders(headers) {
  return normalizeKeyValueList(headers)
}

/**
 * Parse request body
 */
export function parseBody(body) {
  if (!body) return null
  return {
    mode: body.mode || 'raw',
    raw: body.raw || '',
    formdata: body.formdata || [],
    urlencoded: body.urlencoded || [],
  }
}

/**
 * Parse example responses
 */
export function parseResponses(responses) {
  if (!responses || !Array.isArray(responses)) return []
  return responses.map((r) => ({
    name: r.name || 'Response',
    status: r.status || '',
    code: r.code || 0,
    body: r.body || '',
    previewLanguage: r._postman_previewlanguage || 'text',
  }))
}

/**
 * Check if an item is a folder (has sub-items) or a request
 */
export function isFolder(item) {
  return Array.isArray(item.item)
}

/**
 * Normalize request data whether it's a string or object
 */
function normalizeRequest(request) {
  if (typeof request === 'string') {
    return { method: request, url: null, description: '', header: [], body: null }
  }
  return request || {}
}

/**
 * Parse a single request item
 */
export function parseRequest(item) {
  const req = normalizeRequest(item.request)
  return {
    id: item._postman_id || generateId('req'),
    name: item.name || 'Unnamed Request',
    type: 'request',
    method: req.method || 'GET',
    url: parseUrl(req.url),
    description: req.description || '',
    headers: parseHeaders(req.header),
    queryParams: extractQueryParams(req.url),
    body: parseBody(req.body),
    responses: parseResponses(item.response),
  }
}

/**
 * Recursively parse collection items (folders and requests)
 */
export function parseItems(items) {
  if (!items || !Array.isArray(items)) return []

  return items.map((item) => {
    if (isFolder(item)) {
      return {
        id: item._postman_id || generateId('folder'),
        name: item.name || 'Unnamed Folder',
        type: 'folder',
        description: item.description || '',
        children: parseItems(item.item),
      }
    }
    return parseRequest(item)
  })
}

/**
 * Parse a full Postman collection
 */
export function parseCollection(data) {
  const validation = validateCollection(data)
  if (!validation.valid) {
    return { error: validation.error, collection: null }
  }

  resetIdCounter()

  return {
    error: null,
    collection: {
      id: data.info._postman_id || '',
      name: data.info.name || '',
      description: data.info.description || '',
      schema: data.info.schema || '',
      items: parseItems(data.item),
    },
  }
}

/**
 * Flatten all requests from a parsed collection (for README generation)
 */
export function flattenRequests(items, parentPath = '') {
  const requests = []

  for (const item of items) {
    const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name
    if (item.type === 'folder') {
      requests.push(...flattenRequests(item.children, currentPath))
    } else {
      requests.push({ ...item, path: currentPath })
    }
  }

  return requests
}

/**
 * HTTP method color mapping (Swagger-style)
 */
const METHOD_COLORS = Object.freeze({
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  PATCH: '#50e3c2',
  DELETE: '#f93e3e',
  HEAD: '#9012fe',
  OPTIONS: '#0d5aa7',
})

const DEFAULT_METHOD_COLOR = '#999'

/**
 * Get method badge color for display
 */
export function getMethodColor(method) {
  return METHOD_COLORS[method?.toUpperCase()] || DEFAULT_METHOD_COLOR
}

/**
 * Count total requests in a collection
 */
export function countRequests(items) {
  return items.reduce((count, item) => {
    return count + (item.type === 'folder' ? countRequests(item.children) : 1)
  }, 0)
}
