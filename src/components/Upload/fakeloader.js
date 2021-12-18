import React, { useEffect, useState } from "react";
import { Loading } from "@geist-ui/react";

export const FakeLoading = props => {
  let timer;
  const [count, setCount] = useState(0);

  const TTL = props.ttl;

  const updateCount = () => {
    timer =
      !timer &&
      setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

    if (count === TTL) clearInterval(timer);
  };

  useEffect(() => {
    updateCount();

    return () => clearInterval(timer);
  }, [ timer, count ]);

  if (count !== TTL) {
    return <Loading>Dosya yükleniyor</Loading>;
  } else {
    return <></>;
  }
};