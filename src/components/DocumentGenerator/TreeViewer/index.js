import React, { useCallback, useMemo } from 'react'
import { Text, useTheme, Tree } from '@geist-ui/react'
import { countRequests } from '../../../utils/postmanParser'

const METHOD_LABELS = Object.freeze({
  GET: '🟢',
  POST: '🟡',
  PUT: '🟠',
  PATCH: '🔵',
  DELETE: '🔴',
  HEAD: '🟣',
  OPTIONS: '⚪',
})

const DEFAULT_METHOD_LABEL = '⚪'

/**
 * Build a flat lookup map: displayName -> item
 * Geist Tree onClick returns the file path string, so we need to map it back
 */
function buildItemMap(items, parentPath = '') {
  const map = {}
  if (!items) return map

  for (const item of items) {
    if (item.type === 'folder') {
      const folderPath = parentPath ? `${parentPath}/${item.name}` : item.name
      Object.assign(map, buildItemMap(item.children, folderPath))
    } else {
      const method = item.method?.toUpperCase() || 'GET'
      const label = METHOD_LABELS[method] || DEFAULT_METHOD_LABEL
      const displayName = `${label} ${method} - ${item.name}`
      const fullPath = parentPath ? `${parentPath}/${displayName}` : displayName
      map[fullPath] = item
    }
  }
  return map
}

function renderItems(items) {
  if (!items || !Array.isArray(items)) return null

  return items.map((item, index) => {
    if (item.type === 'folder') {
      return (
        <Tree.Folder key={item.id || index} name={item.name}>
          {renderItems(item.children)}
        </Tree.Folder>
      )
    }

    const method = item.method?.toUpperCase() || 'GET'
    const label = METHOD_LABELS[method] || DEFAULT_METHOD_LABEL
    const displayName = `${label} ${method} - ${item.name}`

    return <Tree.File key={item.id || index} name={displayName} />
  })
}

export const TreeViewer = ({ collection, onItemSelect }) => {
  const { palette } = useTheme()

  const itemMap = useMemo(() => {
    if (!collection?.items) return {}
    return buildItemMap(collection.items)
  }, [collection])

  const handleTreeClick = useCallback(
    (path) => {
      const item = itemMap[path]
      if (item && onItemSelect) {
        onItemSelect(item)
      }
    },
    [itemMap, onItemSelect]
  )

  if (!collection || !collection.items) {
    return (
      <Text style={{ color: palette.accents_5 }}>
        Lütfen geçerli bir Postman dosyası yükleyin.
      </Text>
    )
  }

  const totalRequests = countRequests(collection.items)
  const totalFolders = collection.items.filter(
    (i) => i.type === 'folder'
  ).length

  return (
    <>
      <Text h3 style={{ color: palette.cyanDark }}>
        Ağaç Görünümü
      </Text>
      <Text
        small
        style={{ color: palette.accents_5, marginBottom: 8, display: 'block' }}
      >
        {collection.name} — {totalFolders} klasör, {totalRequests} endpoint
      </Text>
      <Tree onClick={handleTreeClick}>
        {renderItems(collection.items)}
      </Tree>
    </>
  )
}
