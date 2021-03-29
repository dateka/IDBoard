import styled from "@emotion/styled";
import {
  faFileMedical,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteSourceCodeDialog } from "common/components/DeleteSourceCodeDialog";
import IconButton from "common/components/IconButton";
import { SaveSourceCodeAsDialog } from "common/components/SaveSourceCodeAsDialog";
import { useSourceCode } from "common/hooks/useSourceCode";
import { initSourceCode } from "common/models/sourceCode";
import globalStyles from "global.module.scss";
import React from "react";
import LevelList from "./LevelList";
import SearchBar from "./SearchBar";

const StyledWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  height: "100%",
});

const StyledIcons = styled.div({
  height: `${globalStyles.iconsHeight}`,
  borderLeft: `3px solid ${globalStyles.darkMagenta}`,
  padding: "6px 10px",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: `${globalStyles.deeperBurgundy}`,
});

const StyledSearchBarAndLevelListWrapper = styled.div({
  height: `${globalStyles.CalculatedHeightSearchBarAndLevelListWrapper}`,
  display: "flex",
  flexDirection: "column",
  backgroundColor: `${globalStyles.lightSaumon}`,
  borderTopRightRadius: `${globalStyles.radius}`,
});

const StyledSearchBar = styled.div({
  height: `${globalStyles.searchBarHeight}`,
});

const StyledLevelList = styled.div({
  height: `${globalStyles.CalculatedHeightLevelList}`,
});

const StyledIconButton = styled(IconButton)({
  color: "white",
  "&:hover": {
    color: `${globalStyles.darkRed}`,
  },
});

const Menu = () => {
  const { setSourceCode } = useSourceCode();
  const [searched, setSearched] = React.useState("");
  const [
    isOpenSaveSourceCodeAsDialog,
    setIsOpenSaveSourceCodeAsDialog,
  ] = React.useState(false);

  const [
    isOpenDeleteSourceCodeDialog,
    setIsOpenDeleteSourceCodeDialog,
  ] = React.useState(false);

  return (
    <StyledWrapper>
      <StyledIcons>
        <StyledIconButton
          icon={faFileMedical}
          size="lg"
          title="New file"
          onClick={() => {
            setSourceCode(initSourceCode);
          }}
        />

        <StyledIconButton
          icon={faTrash}
          size="lg"
          title="Delete file"
          onClick={() => setIsOpenDeleteSourceCodeDialog(true)}
        />

        <StyledIconButton
          icon={faSave}
          size="lg"
          title="Save file"
          onClick={() => setIsOpenSaveSourceCodeAsDialog(true)}
        />
      </StyledIcons>
      <StyledSearchBarAndLevelListWrapper>
        <StyledSearchBar>
          <SearchBar setSearched={setSearched} searched={searched} />
        </StyledSearchBar>
        <StyledLevelList>
          <LevelList searched={searched} />
        </StyledLevelList>
      </StyledSearchBarAndLevelListWrapper>
      <SaveSourceCodeAsDialog
        isOpen={isOpenSaveSourceCodeAsDialog}
        setIsOpen={setIsOpenSaveSourceCodeAsDialog}
      />
      <DeleteSourceCodeDialog
        isOpen={isOpenDeleteSourceCodeDialog}
        setIsOpen={setIsOpenDeleteSourceCodeDialog}
      />
    </StyledWrapper>
  );
};

export default Menu;
