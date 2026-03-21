import { sanitizeHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  it('allows safe HTML tags', () => {
    const result = sanitizeHtml('<h1>Title</h1><p>Text</p>')
    expect(result).toContain('<h1>')
    expect(result).toContain('<p>')
  })

  it('removes script tags', () => {
    const result = sanitizeHtml('<p>Safe</p><script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert')
    expect(result).toContain('Safe')
  })

  it('removes event handlers', () => {
    const result = sanitizeHtml('<div onclick="alert(1)">Click</div>')
    expect(result).not.toContain('onclick')
    expect(result).toContain('Click')
  })

  it('removes iframe tags', () => {
    const result = sanitizeHtml('<iframe src="evil.com"></iframe><p>OK</p>')
    expect(result).not.toContain('iframe')
    expect(result).toContain('OK')
  })

  it('allows style attributes', () => {
    const result = sanitizeHtml('<p style="color:red">Styled</p>')
    expect(result).toContain('style')
    expect(result).toContain('Styled')
  })

  it('allows table elements', () => {
    const result = sanitizeHtml('<table><tr><td>Cell</td></tr></table>')
    expect(result).toContain('<table>')
    expect(result).toContain('<td>')
    expect(result).toContain('Cell')
  })

  it('removes img tags (not in allowlist)', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(result).not.toContain('<img')
    expect(result).not.toContain('onerror')
  })

  it('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('')
  })
})
