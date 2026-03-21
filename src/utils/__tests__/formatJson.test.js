import { formatJson } from '../formatJson'

describe('formatJson', () => {
  it('returns empty string for null/undefined/empty', () => {
    expect(formatJson(null)).toBe('')
    expect(formatJson(undefined)).toBe('')
    expect(formatJson('')).toBe('')
  })

  it('formats valid JSON with indentation', () => {
    const result = formatJson('{"a":1,"b":2}')
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('returns raw string for invalid JSON', () => {
    expect(formatJson('not json')).toBe('not json')
    expect(formatJson('{broken')).toBe('{broken')
  })

  it('handles nested objects', () => {
    const result = formatJson('{"a":{"b":1}}')
    expect(result).toContain('"b": 1')
  })

  it('handles arrays', () => {
    const result = formatJson('[1,2,3]')
    expect(result).toContain('1')
    expect(result).toContain('3')
  })
})
