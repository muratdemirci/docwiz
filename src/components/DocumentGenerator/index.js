import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, useTheme, Grid, Card } from "@geist-ui/react";

import { TreeViewer } from './TreeViewer';
import { ReadmeEditor } from "./ReadmeEditor";

const DocumentGenerator = (props) => {
  const { palette } = useTheme();
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (props.data.progressFinish) {
      setTreeData(props.data.fileData);
    }
  }, []);

  return (
    <>
      <Text h3 style={{ color: palette.violetLight }}>
        Burada dökümanınızı oluşturabilir, düzenleyebilirsiniz.
      </Text>

      <Grid.Container gap={2} justify="center">
        <Grid xs={12}>
          <Card shadow width="100%" height="720px" hoverable>
            <TreeViewer data={treeData} />
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card shadow width="100%" height="720px" hoverable>
          <ReadmeEditor />
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default DocumentGenerator;
