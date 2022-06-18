import React from 'react'
import { Tree } from '@geist-ui/react'
import TreeFileView from './TreeFileView'

function TreeSubFolderView(props) {
  const data = props.data.item
  return Object.values(data).map((postmanItem, index) => (
    <Tree key={index}>
      <Tree.Folder key={index} name={postmanItem.name}>
        <TreeFileView key={index} data={postmanItem} />
      </Tree.Folder>
    </Tree>
  ))
}

export default TreeSubFolderView
