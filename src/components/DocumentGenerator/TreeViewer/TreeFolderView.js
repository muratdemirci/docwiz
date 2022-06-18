import React from 'react'
import { Tree } from '@geist-ui/react'
import TreeSubFolderView from './TreeSubFolderView'

function TreeFolderView(props) {
  const data = props.data
  return Object.values(data).map((postmanItem, index) => (
    <Tree.Folder key={index} name={postmanItem.name}>
      <TreeSubFolderView key={index} data={postmanItem} />
    </Tree.Folder>
  ))
}

export default TreeFolderView
