import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faSortNumericUpAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogButton from "common/components/LogButton";
import React from "react";
import UserInfo from "./UserInfo";
import styled from "@emotion/styled";
import style from "global.module.scss";

const Wrapper = styled.div({
  display: "flex",
  alignItems: "center",
  borderLeft: "none",
  borderRight: "none",
  borderBottom: "none",
  padding: "5px",
  backgroundColor: `${style.lightSaumon}`,
  color: `${style.deeperBurgundy}`,
});

const UserIcon = styled.div({
  float: "left",
  marginRight: "10px",
});

const Rank = styled.div({
  marginLeft: "10px",
  borderRight: `1px solid ${style.deeperBurgundy}`,
  "*": {
    marginRight: "10px",
  },
});

const ButtonLog = styled.div({
  marginLeft: "5px",
});

const UserBar = () => {
  return (
    <Wrapper>
      <UserIcon>
        <FontAwesomeIcon icon={faUserCircle} size="lg" />
      </UserIcon>
      <UserInfo />
      <Rank>
        <FontAwesomeIcon icon={faCrown} size="lg" />
        <FontAwesomeIcon icon={faSortNumericUpAlt} size="lg" />
      </Rank>
      <ButtonLog>
        <LogButton text="Logout" onClick={() => {}} />
      </ButtonLog>
    </Wrapper>
  );
};

export default UserBar;
