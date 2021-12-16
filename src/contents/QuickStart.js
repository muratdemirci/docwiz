import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, useTheme } from "@geist-ui/react";

import UploadFiles from "../components/Upload";
import DocumentGenerator from "../components/DocumentGenerator";

const QuickStart = () => {
  const { palette } = useTheme();
  const [inProgress, setInProgress] = useState(false);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setInProgress((prevCheck) => !prevCheck);
  }, []);

  const childCompRef = useRef(null);
  useLayoutEffect(() => {
    // console.log(childCompRef)
  }, []);

  const eventhandler = (data) => {
    const eventStatus = data;
    if (eventStatus.progressFinish) {
      setInProgress((prevCheck) => !prevCheck);
      setTreeData(eventStatus);
    }
  };

  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
      Hızlı Başlangıç
      </Text>
      {inProgress ? (
        <UploadFiles ref={childCompRef} onChange={eventhandler} />
      ) : (
        <DocumentGenerator data={treeData} />
      )}
    </div>
  );
};

export default QuickStart;
