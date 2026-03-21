import React, { useState, useCallback, useRef, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import { Loading, Note } from '@geist-ui/react'
import { validateCollection } from '../../utils/postmanParser'

import './style.css'

const UploadFiles = ({ onFileLoaded }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const onDrop = useCallback(
    (acceptedFiles) => {
      setError(null)

      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]

      if (!file.name.endsWith('.json')) {
        setError('Lütfen bir JSON dosyası yükleyin.')
        return
      }

      setSelectedFile(file)
      setIsLoading(true)

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)
          const validation = validateCollection(jsonData)

          if (!validation.valid) {
            setError(validation.error)
            setIsLoading(false)
            return
          }

          timerRef.current = setTimeout(() => {
            setIsLoading(false)
            onFileLoaded(jsonData)
          }, 800)
        } catch (parseError) {
          setError('JSON dosyası okunamadı. Lütfen geçerli bir dosya yükleyin.')
          setIsLoading(false)
        }
      }

      reader.onerror = () => {
        setError('Dosya okuma hatası oluştu.')
        setIsLoading(false)
      }

      reader.readAsText(file)
    },
    [onFileLoaded]
  )

  return (
    <div>
      {error && (
        <Note type="error" label="Hata" style={{ marginBottom: 16 }}>
          {error}
        </Note>
      )}

      {isLoading && <Loading>Dosya yükleniyor</Loading>}

      <Dropzone onDrop={onDrop} accept="application/json" multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <section>
            <div
              {...getRootProps({
                className: `dropzone ${isDragActive ? 'dropzone-active' : ''}`,
              })}
            >
              <input {...getInputProps()} data-testid="file-input" />
              {selectedFile ? (
                <div className="selected-file">{selectedFile.name}</div>
              ) : (
                'Postman JSON dosya çıktınızı sürükleyip bırakabilirsiniz ya da buraya tıklayıp seçebilirsiniz'
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  )
}

export default UploadFiles
