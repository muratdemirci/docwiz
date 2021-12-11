import React from "react";
import { Text } from "@geist-ui/react";
import { useTheme } from "@geist-ui/react";

const HowItWorks = () => {
  const { palette } = useTheme();
  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
        How It Works
      </Text>
      <p> Lorem ipsum</p>
    </div>
  );
};

export default HowItWorks;
