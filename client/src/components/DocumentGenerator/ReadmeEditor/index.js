import React from "react";
import { Text, useTheme } from "@geist-ui/react";
import RequestView from "./readmeView";

export const ReadmeEditor = (props) => {
  const { palette } = useTheme();

  return (
    <>
      <Text h3 style={{ color: palette.cyanDark }}>
        {"Readme Editör"}
        <RequestView />
      </Text>
    </>
  );
};
