/**
 * README Generator
 * Single Responsibility: Convert parsed Postman collection to Markdown.
 * Depends on postmanParser (Dependency Inversion via imports).
 */

import { flattenRequests } from './postmanParser'
import { formatJson } from './formatJson'

/**
 * Escape markdown special characters
 */
function escapeMarkdown(text) {
  if (!text) return ''
  return text.replace(/[<>&"']/g, (ch) => {
    const map = { '<': '\\<', '>': '\\>', '&': '&amp;', '"': '\\"', "'": "\\'" }
    return map[ch]
  })
}

/**
 * Generate a GitHub-compatible anchor from a heading name
 */
function toAnchor(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s\u00C0-\u024F-]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Generate markdown table from rows
 * DRY: Shared table generation for headers, params, form data
 */
function generateTable(headers, rows) {
  let md = `| ${headers.join(' | ')} |\n`
  md += `|${headers.map(() => '-----').join('|')}|\n`
  for (const row of rows) {
    md += `| ${row.join(' | ')} |\n`
  }
  return md + '\n'
}

function generateHeader(collection) {
  let md = `# ${escapeMarkdown(collection.name)}\n\n`
  if (collection.description) {
    md += `${collection.description}\n\n`
  }
  return md
}

function generateTOC(items, level = 0) {
  let md = ''
  const indent = '  '.repeat(level)

  for (const item of items) {
    const anchor = toAnchor(item.name)
    if (item.type === 'folder') {
      md += `${indent}- [${item.name}](#${anchor})\n`
      md += generateTOC(item.children, level + 1)
    } else {
      const method = item.method?.toUpperCase() || 'GET'
      md += `${indent}- [\`${method}\` ${item.name}](#${anchor})\n`
    }
  }

  return md
}

/**
 * Generate markdown for a single endpoint.
 * Exported so callers can generate README for one request at a time.
 */
export function generateEndpointReadme(request) {
  let md = `# ${escapeMarkdown(request.name)}\n\n`
  md += generateRequestDoc(request)
  md += `*Bu dokümantasyon [DocWiz](https://github.com/muratdemirci/docwiz) ile otomatik olarak oluşturulmuştur.*\n`
  return md
}

function generateRequestDoc(request) {
  let md = `### ${escapeMarkdown(request.name)}\n\n`
  md += `\`${request.method?.toUpperCase() || 'GET'}\` \`${request.url}\`\n\n`

  if (request.description) {
    md += `${request.description}\n\n`
  }

  // Headers
  const headers = request.headers?.filter((h) => !h.disabled) || []
  if (headers.length > 0) {
    md += `**Headers:**\n\n`
    md += generateTable(
      ['Key', 'Value', 'Description'],
      headers.map((h) => [
        `\`${h.key}\``,
        `\`${h.value}\``,
        h.description || '-',
      ])
    )
  }

  // Query Parameters
  const params = request.queryParams?.filter((p) => !p.disabled) || []
  if (params.length > 0) {
    md += `**Query Parameters:**\n\n`
    md += generateTable(
      ['Parameter', 'Value', 'Description'],
      params.map((p) => [
        `\`${p.key}\``,
        `\`${p.value}\``,
        p.description || '-',
      ])
    )
  }

  // Request Body
  if (request.body?.raw) {
    md += `**Request Body:**\n\n\`\`\`json\n${formatJson(request.body.raw)}\n\`\`\`\n\n`
  }

  // Form Data
  if (request.body?.mode === 'formdata' && request.body.formdata?.length > 0) {
    md += `**Form Data:**\n\n`
    md += generateTable(
      ['Key', 'Value', 'Type'],
      request.body.formdata.map((f) => [
        `\`${f.key}\``,
        `\`${f.value || f.src || ''}\``,
        f.type || 'text',
      ])
    )
  }

  // Responses
  const responses = request.responses || []
  if (responses.length > 0) {
    md += `**Responses:**\n\n`
    for (const resp of responses) {
      md += `*${resp.name}* — \`${resp.code} ${resp.status}\`\n\n`
      if (resp.body) {
        md += `\`\`\`json\n${formatJson(resp.body)}\n\`\`\`\n\n`
      }
    }
  }

  md += '---\n\n'
  return md
}

function generateFolderDoc(folder, level = 2) {
  const heading = '#'.repeat(Math.min(level, 4))
  let md = `${heading} ${escapeMarkdown(folder.name)}\n\n`

  if (folder.description) {
    md += `${folder.description}\n\n`
  }

  for (const child of folder.children) {
    md +=
      child.type === 'folder'
        ? generateFolderDoc(child, level + 1)
        : generateRequestDoc(child)
  }

  return md
}

/**
 * Generate a full README markdown string from a parsed collection
 */
export function generateReadme(collection) {
  if (!collection) return ''

  let md = generateHeader(collection)

  // Table of Contents
  md += `## Table of Contents\n\n`
  md += generateTOC(collection.items)
  md += '\n'

  // Overview
  const allRequests = flattenRequests(collection.items)
  const methodCounts = allRequests.reduce((acc, req) => {
    const m = req.method?.toUpperCase() || 'GET'
    acc[m] = (acc[m] || 0) + 1
    return acc
  }, {})

  md += `## Overview\n\n`
  md += `- **Total Endpoints:** ${allRequests.length}\n`
  for (const [method, count] of Object.entries(methodCounts)) {
    md += `- **${method}:** ${count}\n`
  }
  md += '\n'

  // API Documentation
  md += `## API Documentation\n\n`
  for (const item of collection.items) {
    md +=
      item.type === 'folder'
        ? generateFolderDoc(item)
        : generateRequestDoc(item)
  }

  // Footer
  md += `---\n\n`
  md += `*Bu dokümantasyon [DocWiz](https://github.com/muratdemirci/docwiz) ile otomatik olarak oluşturulmuştur.*\n`

  return md
}

/**
 * Trigger a file download in the browser
 */
export function downloadReadme(markdown, filename = 'README.md') {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
