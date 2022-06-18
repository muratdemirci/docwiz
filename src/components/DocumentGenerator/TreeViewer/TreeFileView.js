import React from 'react'
import { Tree } from '@geist-ui/react'

function TreeFileView(props) {
  const data = Array(props.data)

  let items = data
  let treeFileList = []
  items.forEach((item, index) => {
    treeFileList.push(<Tree.File key={index} name={item.name} />)
  })
  return <Tree>{treeFileList}</Tree>
}

export default TreeFileView

// nah this repo is so boring and pointless. i'm done with this, mah
