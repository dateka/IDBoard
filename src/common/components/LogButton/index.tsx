import React from "react";
import styled from "@emotion/styled";
import globalStyles from "global.module.scss";

type Props = {
  text?: string;
  onClick: () => void;
};

const Button = styled.button({
  border: "none",
  backgroundColor: "red",
  background: "none",
  color: `${globalStyles.deeperBurgundy}`,
  cursor: "pointer",
  padding: "5px 10px",
  "&:hover": {
    backgroundColor: `${globalStyles.deeperBurgundy}`,
    borderRadius: `${globalStyles.radius}`,
    color: `${globalStyles.lightSaumon}`,
  },
  "&:focus": {
    outline: "none",
  },
});

const LogButton = ({ text, onClick }: Props) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export default LogButton;
