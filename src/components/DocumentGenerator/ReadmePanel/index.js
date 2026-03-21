import React, { useState, useMemo } from 'react'
import { Text, useTheme, Button, Spacer, Tabs, Code } from '@geist-ui/react'
import { generateReadme, downloadReadme } from '../../../utils/readmeGenerator'
import { sanitizeHtml } from '../../../utils/sanitize'

export const ReadmePanel = ({ collection }) => {
  const { palette } = useTheme()
  const [activeTab, setActiveTab] = useState('preview')

  const markdown = useMemo(() => {
    if (!collection) return ''
    return generateReadme(collection)
  }, [collection])

  const handleDownload = () => {
    if (!markdown) return
    const filename = collection?.name
      ? `${collection.name.replace(/[^a-zA-Z0-9]/g, '_')}_README.md`
      : 'README.md'
    downloadReadme(markdown, filename)
  }

  if (!collection) {
    return (
      <div data-testid="readme-panel">
        <Text h3 style={{ color: palette.cyanDark }}>
          README Oluşturucu
        </Text>
        <Text style={{ color: palette.accents_5 }}>
          Bir Postman collection yüklediğinizde README otomatik olarak
          oluşturulacaktır.
        </Text>
      </div>
    )
  }

  return (
    <div data-testid="readme-panel">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text h3 style={{ color: palette.cyanDark }}>
          README Önizleme
        </Text>
        <Button
          auto
          size="small"
          type="success"
          onClick={handleDownload}
          data-testid="download-btn"
        >
          README İndir
        </Button>
      </div>

      <Spacer h={0.5} />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.Item label="Önizleme" value="preview">
          <div
            data-testid="readme-preview"
            style={{
              maxHeight: '600px',
              overflow: 'auto',
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '6px',
              border: '1px solid #eaeaea',
            }}
          >
            <MarkdownPreview markdown={markdown} />
          </div>
        </Tabs.Item>
        <Tabs.Item label="Markdown Kaynak" value="source">
          <Code
            block
            data-testid="readme-source"
            style={{
              maxHeight: '600px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {markdown}
          </Code>
        </Tabs.Item>
      </Tabs>
    </div>
  )
}

/**
 * Markdown preview with DOMPurify sanitization
 */
const MarkdownPreview = React.memo(({ markdown }) => {
  const html = useMemo(() => {
    if (!markdown) return ''
    const rawHtml = markdownToHtml(markdown)
    return sanitizeHtml(rawHtml)
  }, [markdown])

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})

MarkdownPreview.displayName = 'MarkdownPreview'

/**
 * Lightweight markdown to HTML converter
 * Only processes our own generated markdown - DOMPurify handles sanitization
 */
function markdownToHtml(md) {
  let html = md

  // Code blocks (must be first to protect content inside)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre style="background:#f6f8fa;padding:12px;border-radius:6px;overflow-x:auto;font-size:0.85em"><code>${escaped}</code></pre>`
  })

  // Escape HTML in non-code content
  html = html.replace(/&(?!amp;|lt;|gt;)/g, '&amp;')

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:0.9em">$1</code>'
  )

  // Headers (process longest first)
  html = html.replace(/^#### (.+)$/gm, '<h4 style="margin:16px 0 8px">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 style="margin:16px 0 8px">$1</h3>')
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="margin:20px 0 10px;border-bottom:1px solid #eee;padding-bottom:6px">$1</h2>'
  )
  html = html.replace(/^# (.+)$/gm, '<h1 style="margin:24px 0 12px">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match
      .split('|')
      .filter((c) => c.trim())
      .map((c) => c.trim())
    if (cells.every((c) => /^[-:]+$/.test(c))) return '<!-- sep -->'
    const tds = cells
      .map(
        (c) => `<td style="padding:6px 12px;border:1px solid #ddd">${c}</td>`
      )
      .join('')
    return `<tr>${tds}</tr>`
  })
  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>)\n<!-- sep -->\n/g,
    (_, headerRow) =>
      `<table style="border-collapse:collapse;width:100%;margin:8px 0">${headerRow.replace(/<td/g, '<th').replace(/<\/td>/g, '</th>')}`
  )
  html = html.replace(/(<\/tr>)\n(?!<tr>)/g, '$1</table>\n')

  // Horizontal rules
  html = html.replace(
    /^---$/gm,
    '<hr style="margin:16px 0;border:none;border-top:1px solid #eee">'
  )

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/g,
    (match) => `<ul style="padding-left:20px;margin:8px 0">${match}</ul>`
  )

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p style="margin:8px 0">')
  html = `<p style="margin:8px 0">${html}</p>`
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '')

  return html
}
