import styled from "@emotion/styled";
import { CircularProgress } from "@material-ui/core";
import { useUser } from "common/hooks/useUser";
import { Footer } from "components/Footer";
import { Header } from "components/Header";
import Login from "components/LoginPage";
import MainPage from "components/MainPage";
import globalStyles from "global.module.scss";
import React from "react";

const StyledMain = styled.main({
  fontFamily: `${globalStyles.font}`,
});

const StyledHeader = styled.div({
  height: `${globalStyles.headerSize}`,
  backgrounColor: `${globalStyles.white}`,
  borderBottom: "1px solid black",
});

const StyledContent = styled.div({
  height: `${globalStyles.CalculatedHeight}`,
});

const StyledFooter = styled.div({
  height: `${globalStyles.footerSize}`,
  backgroundColor: `${globalStyles.white}`,
  borderTop: "1px solid black",
});

export const AppContent = () => {
  const { user, queryUser } = useUser();

  if (queryUser.isLoading) return <CircularProgress />;

  return (
    <StyledMain>
      <StyledHeader>
        <Header />
      </StyledHeader>
      <StyledContent>{user ? <MainPage /> : <Login />}</StyledContent>
      <StyledFooter>
        <Footer />
      </StyledFooter>
    </StyledMain>
  );
};
