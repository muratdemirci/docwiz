import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@geist-ui/react";

const Navitem = (props) => {
  const { palette } = useTheme();
  
    return (
      <li id={props.item}>
        <Link
          to={props.tolink}
          style={{ color: palette.violetLighter }}
          onClick={props.activec.bind(this, props.item)}
        >
          {props.item}
        </Link>
      </li>
    );
}

export default Navitem;