import {
  validateCollection,
  parseUrl,
  extractQueryParams,
  parseHeaders,
  parseBody,
  parseResponses,
  isFolder,
  parseRequest,
  parseItems,
  parseCollection,
  flattenRequests,
  getMethodColor,
  countRequests,
  resetIdCounter,
} from '../postmanParser'

import sampleCollection from '../../test-data/sample-collection.json'

describe('postmanParser', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  describe('validateCollection', () => {
    it('returns valid for a correct Postman v2.1 collection', () => {
      const result = validateCollection(sampleCollection)
      expect(result.valid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('returns invalid for null input', () => {
      const result = validateCollection(null)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Geçersiz')
    })

    it('returns invalid for non-object input', () => {
      const result = validateCollection('not an object')
      expect(result.valid).toBe(false)
    })

    it('returns invalid for missing info', () => {
      const result = validateCollection({ item: [] })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('info')
    })

    it('returns invalid for missing name', () => {
      const result = validateCollection({ info: {}, item: [] })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('adı')
    })

    it('returns invalid for missing items', () => {
      const result = validateCollection({ info: { name: 'Test' } })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('item')
    })

    it('returns invalid for unsupported schema', () => {
      const result = validateCollection({
        info: { name: 'Test', schema: 'https://unsupported.com/v1' },
        item: [],
      })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Desteklenmeyen')
    })

    it('accepts collections without explicit schema', () => {
      const result = validateCollection({
        info: { name: 'Test' },
        item: [],
      })
      expect(result.valid).toBe(true)
    })
  })

  describe('parseUrl', () => {
    it('returns empty string for null/undefined', () => {
      expect(parseUrl(null)).toBe('')
      expect(parseUrl(undefined)).toBe('')
    })

    it('returns string URLs as-is', () => {
      expect(parseUrl('https://api.example.com')).toBe(
        'https://api.example.com'
      )
    })

    it('extracts raw URL from object', () => {
      expect(
        parseUrl({
          raw: 'https://api.example.com/users',
          host: ['api', 'example', 'com'],
        })
      ).toBe('https://api.example.com/users')
    })
  })

  describe('extractQueryParams', () => {
    it('returns empty array for null input', () => {
      expect(extractQueryParams(null)).toEqual([])
    })

    it('returns empty array for string URL', () => {
      expect(extractQueryParams('https://api.com')).toEqual([])
    })

    it('extracts query params from URL object', () => {
      const url = {
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10' },
        ],
      }
      const params = extractQueryParams(url)
      expect(params).toHaveLength(2)
      expect(params[0].key).toBe('page')
      expect(params[0].description).toBe('Page number')
      expect(params[1].description).toBe('')
    })
  })

  describe('parseHeaders', () => {
    it('returns empty array for null', () => {
      expect(parseHeaders(null)).toEqual([])
    })

    it('parses headers correctly', () => {
      const headers = [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json', disabled: true },
      ]
      const result = parseHeaders(headers)
      expect(result).toHaveLength(2)
      expect(result[0].key).toBe('Authorization')
      expect(result[1].disabled).toBe(true)
    })
  })

  describe('parseBody', () => {
    it('returns null for null input', () => {
      expect(parseBody(null)).toBeNull()
    })

    it('parses raw body', () => {
      const body = { mode: 'raw', raw: '{"key": "value"}' }
      const result = parseBody(body)
      expect(result.mode).toBe('raw')
      expect(result.raw).toBe('{"key": "value"}')
    })

    it('handles missing fields gracefully', () => {
      const body = {}
      const result = parseBody(body)
      expect(result.mode).toBe('raw')
      expect(result.raw).toBe('')
    })
  })

  describe('parseResponses', () => {
    it('returns empty array for null', () => {
      expect(parseResponses(null)).toEqual([])
    })

    it('parses responses correctly', () => {
      const responses = [
        {
          name: 'Success',
          status: 'OK',
          code: 200,
          body: '{"id": 1}',
          _postman_previewlanguage: 'json',
        },
      ]
      const result = parseResponses(responses)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Success')
      expect(result[0].code).toBe(200)
      expect(result[0].previewLanguage).toBe('json')
    })
  })

  describe('isFolder', () => {
    it('returns true for items with sub-items', () => {
      expect(isFolder({ item: [] })).toBe(true)
    })

    it('returns false for items without sub-items', () => {
      expect(isFolder({ request: {} })).toBe(false)
    })
  })

  describe('parseRequest', () => {
    it('parses a complete request', () => {
      const item = {
        name: 'Get Users',
        request: {
          method: 'GET',
          header: [{ key: 'Authorization', value: 'Bearer token' }],
          url: { raw: 'https://api.com/users' },
          description: 'Get all users',
        },
        response: [{ name: 'OK', code: 200, status: 'OK', body: '[]' }],
      }
      const result = parseRequest(item)
      expect(result.name).toBe('Get Users')
      expect(result.method).toBe('GET')
      expect(result.type).toBe('request')
      expect(result.headers).toHaveLength(1)
      expect(result.responses).toHaveLength(1)
    })

    it('handles string request method', () => {
      const item = { name: 'Simple', request: 'GET' }
      const result = parseRequest(item)
      expect(result.method).toBe('GET')
    })

    it('defaults to GET for missing method', () => {
      const item = { name: 'No Method', request: {} }
      const result = parseRequest(item)
      expect(result.method).toBe('GET')
    })
  })

  describe('parseItems', () => {
    it('returns empty array for null', () => {
      expect(parseItems(null)).toEqual([])
    })

    it('parses folders and requests recursively', () => {
      const items = [
        {
          name: 'Auth',
          item: [
            {
              name: 'Login',
              request: { method: 'POST', url: { raw: '/login' } },
            },
          ],
        },
        {
          name: 'Health Check',
          request: { method: 'GET', url: { raw: '/health' } },
        },
      ]
      const result = parseItems(items)
      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('folder')
      expect(result[0].children).toHaveLength(1)
      expect(result[1].type).toBe('request')
    })
  })

  describe('parseCollection', () => {
    it('parses the sample collection successfully', () => {
      const { error, collection } = parseCollection(sampleCollection)
      expect(error).toBeNull()
      expect(collection).not.toBeNull()
      expect(collection.name).toBe('Task Manager API')
      expect(collection.items).toHaveLength(3) // Auth, Tasks, Users
    })

    it('returns error for invalid collection', () => {
      const { error, collection } = parseCollection({})
      expect(error).not.toBeNull()
      expect(collection).toBeNull()
    })

    it('parses nested items correctly', () => {
      const { collection } = parseCollection(sampleCollection)
      const authFolder = collection.items[0]
      expect(authFolder.type).toBe('folder')
      expect(authFolder.name).toBe('Auth')
      expect(authFolder.children).toHaveLength(2)
      expect(authFolder.children[0].name).toBe('Register User')
      expect(authFolder.children[0].method).toBe('POST')
    })
  })

  describe('flattenRequests', () => {
    it('flattens nested collection items', () => {
      const { collection } = parseCollection(sampleCollection)
      const flat = flattenRequests(collection.items)
      expect(flat).toHaveLength(10) // 2 auth + 5 tasks + 3 users
      expect(flat[0].path).toContain('Auth')
      expect(flat[0].path).toContain('Register User')
    })

    it('handles empty items', () => {
      expect(flattenRequests([])).toEqual([])
    })
  })

  describe('getMethodColor', () => {
    it('returns correct colors for known methods', () => {
      expect(getMethodColor('GET')).toBe('#61affe')
      expect(getMethodColor('POST')).toBe('#49cc90')
      expect(getMethodColor('DELETE')).toBe('#f93e3e')
    })

    it('returns default color for unknown methods', () => {
      expect(getMethodColor('UNKNOWN')).toBe('#999')
    })

    it('handles case insensitivity', () => {
      expect(getMethodColor('get')).toBe('#61affe')
    })
  })

  describe('countRequests', () => {
    it('counts all requests in nested structure', () => {
      const { collection } = parseCollection(sampleCollection)
      expect(countRequests(collection.items)).toBe(10)
    })

    it('returns 0 for empty items', () => {
      expect(countRequests([])).toBe(0)
    })
  })
})
