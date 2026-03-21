import React, { useState, useCallback } from 'react'
import { Text, useTheme } from '@geist-ui/react'

import UploadFiles from '../components/Upload'
import DocumentGenerator from '../components/DocumentGenerator'
import { parseCollection } from '../utils/postmanParser'

const QuickStart = () => {
  const { palette } = useTheme()
  const [collection, setCollection] = useState(null)

  const handleFileLoaded = useCallback((rawData) => {
    const { error, collection: parsed } = parseCollection(rawData)
    if (error) {
      console.error('Parse error:', error)
      return
    }
    setCollection(parsed)
  }, [])

  const handleReset = useCallback(() => {
    setCollection(null)
  }, [])

  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
        Hızlı Başlangıç
      </Text>
      {!collection ? (
        <UploadFiles onFileLoaded={handleFileLoaded} />
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <Text
              span
              style={{
                color: palette.violet,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={handleReset}
            >
              Yeni dosya yükle
            </Text>
          </div>
          <DocumentGenerator collection={collection} />
        </>
      )}
    </div>
  )
}

export default QuickStart
