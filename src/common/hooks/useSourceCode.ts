import { SourceCodeContext } from "common/contexts/SourceCode";
import React from "react";

export function useSourceCode() {
  const { sourceCode, setSourceCode } = React.useContext(SourceCodeContext);
  return {
    sourceCode,
    setSourceCode,
  };
}
