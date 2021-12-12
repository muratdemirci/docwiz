import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, useTheme } from "@geist-ui/react";

import UploadFiles from "../components/Upload";

const QuickStart = () => {
  const { palette } = useTheme();
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setInProgress(prevCheck => !prevCheck);
  }, []);

  const childCompRef = useRef(null);
  useLayoutEffect(() => {
    console.log(childCompRef)
  }, []);

  const eventhandler = (data) => {
    const eventStatus = data;
    // console.log(eventStatus);
    if (eventStatus.progressFinish) {
      setInProgress(prevCheck => !prevCheck); 
    }
  };

  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
        Quick Start
      </Text>
      {inProgress && <UploadFiles ref={childCompRef} onChange={eventhandler} />}
    </div>
  );
};

export default QuickStart;
