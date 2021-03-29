import Logo from "common/components/Logo";
import React from "react";
import logoSrc from "./logo.png";
import UserBar from "./UserBar";
import styled from "@emotion/styled";
import styles from "global.module.scss";

const HeaderContainer = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
});

const LogoWrapper = styled.div({
  marginLeft: "23px",
});

const Title = styled.h1({
  color: "red",
  span: {
    color: `${styles.deeperBurgundy}`,
  },
});

const UserBarStyled = styled.div({
  alignSelf: "flex-end",
  display: "flex",
});

const ColoredAngleLine = styled.div({
  height: 0,
  width: 0,
  borderBottom: `50px solid ${styles.lightSaumon}`,
  borderLeft: "50px solid transparent",
});

export const Header: React.FC = React.memo(() => {
  return (
    <HeaderContainer>
      <LogoWrapper>
        <Logo src={logoSrc} alt="campus" size="80px" />
      </LogoWrapper>
      <Title>
        ID<span>Algo</span>
      </Title>
      <UserBarStyled>
        <ColoredAngleLine />
        <UserBar />
      </UserBarStyled>
    </HeaderContainer>
  );
});
