import React, { useState, useCallback } from 'react'
import { Text, useTheme, Grid, Card } from '@geist-ui/react'

import { TreeViewer } from './TreeViewer'
import { ReadmePanel } from './ReadmePanel'
import { EndpointDetail } from './EndpointDetail'
import {
  generateEndpointReadme,
  downloadReadme,
} from '../../utils/readmeGenerator'

const DocumentGenerator = ({ collection }) => {
  const { palette } = useTheme()
  const [selectedItem, setSelectedItem] = useState(null)

  const handleItemSelect = (item) => {
    setSelectedItem(item)
  }

  const handleDownloadReadme = useCallback(() => {
    if (!selectedItem) return
    const markdown = generateEndpointReadme(selectedItem)
    const filename = `${selectedItem.name.replace(/[^a-zA-Z0-9]/g, '_')}_README.md`
    downloadReadme(markdown, filename)
  }, [selectedItem])

  return (
    <>
      <Text h3 style={{ color: palette.violetLight }}>
        Burada dökümanınızı oluşturabilir, düzenleyebilirsiniz.
      </Text>

      <Grid.Container gap={2} justify="center">
        <Grid xs={12}>
          <Card shadow width="100%" style={{ minHeight: '720px' }} hoverable>
            <TreeViewer
              collection={collection}
              onItemSelect={handleItemSelect}
            />
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card shadow width="100%" hoverable style={{ minHeight: '720px' }}>
            {selectedItem ? (
              <EndpointDetail
                item={selectedItem}
                onDownloadReadme={handleDownloadReadme}
              />
            ) : (
              <ReadmePanel collection={collection} />
            )}
          </Card>
        </Grid>
      </Grid.Container>
    </>
  )
}

export default DocumentGenerator
