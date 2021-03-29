import styled from "@emotion/styled";
import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import globalStyles from "global.module.scss";

type Props = {
  onClick: () => void;
  icon: IconProp;
  size: SizeProp;
  title: string;
  className?: string;
};

const IconContainer = styled.div({
  cursor: "pointer",
  padding: "3px 6px",
  borderRadius: `${globalStyles.radius}`,
  display: "flex",
  alignItems: "center",
  color: "white",
});

const IconButton = ({ onClick, icon, size, title, className }: Props) => {
  return (
    <IconContainer className={className} onClick={onClick} title={title}>
      <FontAwesomeIcon icon={icon} size={size} />
    </IconContainer>
  );
};

export default IconButton;
