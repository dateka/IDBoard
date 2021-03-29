import styled from "@emotion/styled";
import { SourceCodeProvider } from "common/contexts/SourceCode";
import style from "global.module.scss";
import React from "react";
import { CodeArea } from "./CodeArea";
import CodeRenderer from "./CodeRenderer";
import Menu from "./Menu";

const Wrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
});

const StyledMenu = styled.div({
  backgroundColor: `${style.deeperBurgundy}`,
  minWidth: "15%",
  width: "15%",
});

const StyledCodeEditor = styled.div({
  width: "40%",
  resize: "horizontal",
  overflow: "auto",
  minWidth: "30%",
});

const StyledCodeRenderer = styled.div({
  height: "100%",
  overflow: "auto",
  marginLeft: "auto",
  marginRight: "auto",
  minWidth: "20%",
});

const MainPage = () => {
  return (
    <SourceCodeProvider>
      <Wrapper>
        <StyledMenu>
          <Menu />
        </StyledMenu>
        <StyledCodeEditor>
          <CodeArea />
        </StyledCodeEditor>
        <StyledCodeRenderer>
          <CodeRenderer />
        </StyledCodeRenderer>
      </Wrapper>
    </SourceCodeProvider>
  );
};

export default MainPage;
