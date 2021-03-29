import styled from "@emotion/styled";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import IconButton from "common/components/IconButton";
import { useSourceCode } from "common/hooks/useSourceCode";
import { getHash } from "common/utils/hashKeyUtils";
import * as characterUppercase from "common/utils/stringUtils";
import globalStyles from "global.module.scss";
import React from "react";
import Line from "./Line";

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  backgroundColor: `${globalStyles.deeperBurgundy}`,
  height: "100%",
  width: "100%",
  color: "white",
});

export const EditorHeaderContainer = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const LevelInfos = styled.p({
  fontWeight: "bold",
  borderBottom: "solid 2px white",
  padding: "5px 10px 0 10px",
  marginLeft: "30px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  minWidth: "50%",
});

export const RunButton = styled.div({
  marginTop: "6px",
  marginRight: "6px",
  color: "white",
  "svg:first-of-type": {
    color: "white",
    "&:hover": {
      color: "black",
    },
  },
});

const CodeTextArea = styled.div({
  background: "none",
  height: "100%",
  overflowY: "auto",
});

export type LineType = {
  id: number;
  index: number;
  content: string;
  focus: boolean;
};

const CodeEditor = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sourceCode, setSourceCode } = useSourceCode();
  const [lines, setLines] = React.useState<LineType[]>([]);

  React.useEffect(() => {
    if (sourceCode) {
      const originLines: LineType[] = sourceCode.content.split("\n").map(
        (content, index): LineType => ({
          id: getHash(),
          index: index,
          content,
          focus: false,
        })
      );
      setLines(originLines);
    }
  }, [sourceCode]);

  const createNewLine = (line: LineType) => {
    if (lines) {
      let previousLines: LineType[] = [...lines].filter(
        (l) => l.index <= line.index
      );

      let nextLines: LineType[] = [...lines]
        .filter((l) => l.index > line.index)
        .map((l) => ({ ...l, index: l.index + 1 }));

      const newLine = {
        id: getHash(),
        index: line.index + 1,
        content: "",
        focus: true,
      };

      const newLines = [...previousLines, newLine, ...nextLines];
      newLines
        .filter((l) => l.id !== newLine.id)
        .forEach((l) => (l.focus = false));
      setLines(newLines);
    }
  };

  const focusPreviousLine = (line: LineType) => {
    let linesCopy = [...lines];
    linesCopy.forEach((l) => (l.focus = false));
    let lineToFocus = linesCopy.find((l) => l.index === line.index - 1);
    if (lineToFocus) lineToFocus.focus = true;
    setLines(linesCopy);
  };

  const focusNextLine = (line: LineType) => {
    let linesCopy = [...lines];
    linesCopy.forEach((l) => (l.focus = false));
    let lineToFocus = linesCopy.find((l) => l.index === line.index + 1);
    if (lineToFocus) lineToFocus.focus = true;
    setLines(linesCopy);
  };

  return (
    <Wrapper>
      {lines && (
        <>
          <EditorHeaderContainer>
            <LevelInfos>
              {sourceCode.id !== 0
                ? `${characterUppercase.firstCharToUppercase(
                    "Test"
                    // sourceCode.levelName
                  )} / ${sourceCode.name}`
                : "New"}
            </LevelInfos>
            <RunButton>
              <IconButton
                icon={faPlayCircle}
                onClick={() => console.log("run")}
                size="lg"
                title="RunCode"
              />
            </RunButton>
          </EditorHeaderContainer>
          <CodeTextArea>
            {lines.map((line, index) => (
              <Line
                key={line.id}
                initialLine={line}
                index={index}
                createNewLine={createNewLine}
                focusPreviousLine={focusPreviousLine}
                focusNextLine={focusNextLine}
                focus={line.focus}
              />
            ))}
          </CodeTextArea>
        </>
      )}
    </Wrapper>
  );
};

export default CodeEditor;
