import styled from "@emotion/styled";
import { LineType } from "components/MainPage/CodeEditor";
import globalStyles from "global.module.scss";
import React, { ChangeEvent, KeyboardEvent } from "react";

type LineProps = {
  initialLine: LineType;
  index: number;
  createNewLine: (line: LineType) => void;
  focusPreviousLine: (line: LineType) => void;
  focusNextLine: (line: LineType) => void;
  focus: boolean;
};

const Line = ({
  initialLine,
  index,
  createNewLine,
  focusPreviousLine,
  focusNextLine,
  focus,
}: LineProps) => {
  const [line, setLine] = React.useState(initialLine);
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (focus && input) input.current?.focus();
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLine({ ...initialLine, content: event.target.value });

  const handleNew = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setLine({ ...initialLine, content: line.content + "\n" });
      createNewLine(line);
    }
  };

  const handleMove = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      focusPreviousLine(line);
    }

    if (event.key === "ArrowDown") {
      focusNextLine(line);
    }

    if (
      event.key === "ArrowLeft" &&
      (event.target as HTMLInputElement).selectionStart === 0
    ) {
      focusPreviousLine(line);
    }

    if (
      event.key === "ArrowRight" &&
      (event.target as HTMLInputElement).selectionStart === line.content.length
    ) {
      focusNextLine(line);
    }
  };

  const Wrapper = styled.div({
    display: "flex",
    marginLeft: "20px",
  });

  const LineNumber = styled.span({
    marginRight: "15px",
    width: "45px",
    borderRight: "1px solid grey",
  });

  const Input = styled.input({
    flex: "2",
    color: `${globalStyles.white}`,
    backgroundColor: "unset",
    outline: "unset",
    border: "none",
  });

  return (
    <Wrapper>
      <LineNumber className={globalStyles.lineNumber}>{index + 1}</LineNumber>
      <Input
        className={globalStyles.input}
        spellCheck="false"
        onChange={handleChange}
        value={line.content}
        onKeyPress={handleNew}
        onKeyDown={handleMove}
        ref={input}
      />
    </Wrapper>
  );
};

export default Line;
