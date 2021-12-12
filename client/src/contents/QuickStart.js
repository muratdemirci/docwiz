import React from "react";
import { Text, useTheme } from "@geist-ui/react";

import UploadFiles from "../components/Upload";

const QuickStart = () => {
  const { palette } = useTheme();
  const [inProgress, setInProgress] = React.useState(false);

  React.useEffect(() => {
    setInProgress(true);
  }, []);

  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
        Quick Start
      </Text>
      <UploadFiles />
    </div>
  );
};

export default QuickStart;
