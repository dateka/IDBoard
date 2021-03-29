import { initSourceCode, SourceCode } from "common/models/sourceCode";
import React from "react";

type SourceCodeContextType = {
  sourceCode: SourceCode;
  setSourceCode: (sourceCode: SourceCode) => void;
};

export const SourceCodeContext = React.createContext<SourceCodeContextType>({
  sourceCode: initSourceCode,
  setSourceCode: (sourceCode: SourceCode): void => {},
});

export const SourceCodeProvider: React.FC = (props) => {
  const [sourceCode, setSourceCode] = React.useState<SourceCode>(
    initSourceCode
  );

  return (
    <SourceCodeContext.Provider
      value={{ sourceCode, setSourceCode }}
      {...props}
    ></SourceCodeContext.Provider>
  );
};
