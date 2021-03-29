import styled from "@emotion/styled";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import IconButton from "common/components/IconButton";
import { SaveSourceCodeAsDialog } from "common/components/SaveSourceCodeAsDialog";
import { useSourceCode } from "common/hooks/useSourceCode";
import { saveSourceCode } from "common/utils/apiService";
import { firstCharToUppercase } from "common/utils/stringUtils";
import globalStyles from "global.module.scss";
import * as React from "react";
import { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "react-query";

const StyledWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  backgroundColor: `${globalStyles.deeperBurgundy}`,
  color: `${globalStyles.white}`,
  Width: "100%",
  height: "100%",
});

const EditorHeaderContainer = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "13px",
});

const LevelInfos = styled.p({
  fontWeight: "bold",
  borderBottom: `solid 2px ${globalStyles.white}`,
  padding: "5px 10px 0 10px",
  marginLeft: "30px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  minWidth: "50%",
});

const RunButton = styled.div({
  marginTop: "6px",
  marginRight: "6px",
  color: "white",
  "svg:first-of-type": {
    color: "white",
    "&:hover": {
      color: `${globalStyles.lightSaumon}`,
    },
  },
});

const StyledTextArea = styled.textarea({
  border: "none",
  outline: "none",
  width: "100%",
  maxWidth: "100%",
  resize: "none",
  height: "100%",
  padding: "0 30px 30px 30px",
  backgroundColor: `${globalStyles.deeperBurgundy}`,
  color: `${globalStyles.white}`,
});

export const CodeArea = () => {
  const queryClient = useQueryClient();
  const { sourceCode, setSourceCode } = useSourceCode();
  const [
    isOpenSaveSourceCodeAsDialog,
    setIsOpenSaveSourceCodeAsDialog,
  ] = React.useState(false);

  const mutation = useMutation(saveSourceCode, {
    onSuccess: () => {
      queryClient.invalidateQueries("levels");
    },
  });

  const changeContent = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    if (sourceCode) setSourceCode({ ...sourceCode, content: target.value });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "s") {
        event.preventDefault();
        if (sourceCode?.name && sourceCode.id) mutation.mutate(sourceCode);
        else setIsOpenSaveSourceCodeAsDialog(true);
      }
    }
  };

  return (
    <StyledWrapper>
      <EditorHeaderContainer>
        <LevelInfos>
          {sourceCode.id !== 0
            ? `${firstCharToUppercase(sourceCode.levelName)} / ${
                sourceCode.name
              }`
            : "Nouveau code source"}
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
      <StyledTextArea
        id="text"
        onChange={changeContent}
        value={sourceCode?.content}
        onKeyDown={handleKeyDown}
      ></StyledTextArea>
      <SaveSourceCodeAsDialog
        isOpen={isOpenSaveSourceCodeAsDialog}
        setIsOpen={setIsOpenSaveSourceCodeAsDialog}
      />
    </StyledWrapper>
  );
};
