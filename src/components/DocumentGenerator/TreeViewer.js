import React from "react";
import { Text, useTheme, Tree } from "@geist-ui/react";

export const TreeViewer = (props) => {
  const handler = (path) => console.log({ text: path });
  const { palette } = useTheme();

  // const data = props.data || [];
  console.log(props)

  return (
    <>
      <Text h3 style={{ color: palette.cyanDark }}>
        {"Ağaç Görünümü"}
      </Text>
      {props.data ? (
        <Tree onClick={handler}>
          <Tree.Folder name="Collections">
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
            <Tree.Folder name="All Collections">
              <Tree.File name="lorem (GET)" />
              <Tree.File name="ipsum (UPDATE)" />
              <Tree.File name="lorem (PUT)" />
            </Tree.Folder>
          </Tree.Folder>
          <Tree.Folder name="Environments">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="Mocks">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="Monitors">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="Workspaces">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="User">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="Import">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="API">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.Folder name="WebHooks">
            {" "}
            <Tree.File name="lorem (GET)" />
            <Tree.File name="ipsum (UPDATE)" />
            <Tree.File name="lorem (PUT)" />
          </Tree.Folder>
          <Tree.File name="API KEY" />
          <Tree.File name="HEADERS" />
        </Tree>
      ) : (
        <Text>Lütfen geçerli bir Postman dosyası yükleyin.</Text>
      )}
    </>
  );
};
