/**
 * Single Responsibility: HTML sanitization for XSS protection.
 * Wraps DOMPurify for a single, testable sanitization boundary.
 */
import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'code', 'pre',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'span', 'div',
]

const ALLOWED_ATTR = ['style', 'href', 'class']

export function sanitizeHtml(dirtyHtml) {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}
