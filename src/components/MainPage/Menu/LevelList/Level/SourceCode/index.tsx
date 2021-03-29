import styled from "@emotion/styled";
import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSourceCode } from "common/hooks/useSourceCode";
import { SourceCode as SourceCodeType } from "common/models/sourceCode";
import globalStyles from "global.module.scss";
import React from "react";

type Props = {
  sourceCode: SourceCodeType;
};

const Wrapper = styled.div({
  whiteSpace: "nowrap",
  overflowX: "hidden",
  height: "30px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    borderLeft: `3px solid ${globalStyles.darkMagenta}`,
    borderBottomRightRadius: `${globalStyles.radius}`,
    borderTopRightRadius: `${globalStyles.radius}`,
    backgroundColor: `${globalStyles.deeperBurgundy}`,
    "& > span": { color: `${globalStyles.lightSaumon}` },
  },
});

const Icon = styled.div({
  marginLeft: "20px",
  marginRight: "5px",
});

const Success = styled.div({
  "*": {
    color: `${globalStyles.lightFlashGreen}`,
  },
});

const Fail = styled.div({
  "*": {
    color: `${globalStyles.verylightRed}`,
  },
});

const Text = styled.span({
  color: `${globalStyles.deeperBurgundy}`,
});

const SourceCode = ({ sourceCode }: Props) => {
  const { name } = sourceCode;
  const { setSourceCode } = useSourceCode();

  function handleSourceCode() {
    setSourceCode(sourceCode);
  }

  return (
    <Wrapper title={name} onClick={handleSourceCode}>
      <Icon>
        {sourceCode.isSuccess ? (
          <Success>
            <FontAwesomeIcon icon={faCheckCircle} />
          </Success>
        ) : (
          <Fail>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </Fail>
        )}
      </Icon>
      <Text>{name}</Text>
    </Wrapper>
  );
};

export default SourceCode;
