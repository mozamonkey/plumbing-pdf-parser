"use client";
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const JsonViewer = (data: any) => {
  return (
    <JsonView
      data={data}
      shouldExpandNode={allExpanded}
      style={defaultStyles}
    />
  );
};

export default JsonViewer;
