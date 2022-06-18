import React from 'react'
import { Text, useTheme, Tree } from '@geist-ui/react'
import TreeFolderView from './TreeFolderView'

export const TreeViewer = (props) => {
  const handler = (path) => console.log({ text: path })
  const { palette } = useTheme()

  const postmanOutput = props.data.item || []

  // let randomUniqKey = (Math.random() + 1).toString(36).substring(7);

  return (
    <>
      <Text h3 style={{ color: palette.cyanDark }}>
        {'Ağaç Görünümü'}
      </Text>
      {postmanOutput ? (
        <Tree onClick={handler}>
          <TreeFolderView data={postmanOutput} />
        </Tree>
      ) : (
        <Text>Lütfen geçerli bir Postman dosyası yükleyin.</Text>
      )}
    </>
  )
}
