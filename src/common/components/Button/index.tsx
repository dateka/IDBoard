import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "@emotion/styled";

type Props = {
  text: string;
  onClick: () => void;
  icon?: IconProp;
  size?: any;
};

const StyledButton = styled.div({
  cursor: "pointer",
});

const Button = ({ text, onClick, icon, size }: Props) => {
  return (
    <StyledButton onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} size={size} />}
      <span>{text}</span>
    </StyledButton>
  );
};

export default Button;
