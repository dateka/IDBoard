import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent } from "react";
import globalStyles from "global.module.scss";
import styled from "@emotion/styled";

const Wrapper = styled.div({
  display: "flex",
  alignItems: "center",
  margin: "10px",
  backgroundColor: `${globalStyles.white}`,
  color: `${globalStyles.deeperBurgundy}`,
  border: `1px solid ${globalStyles.deeperBurgundy}`,
  borderRadius: `${globalStyles.radius}`,
});

const Icon = styled.div({
  marginLeft: "5px",
  marginRight: "3px",
});

const StyledInput = styled.input({
  margin: "5px 0",
  width: "85%",
  outline: "none",
  border: "none",
  color: `${globalStyles.deeperBurgundy}`,
});

type SearchBarProps = {
  setSearched: (value: string) => void;
  searched: string;
};

const SearchBar = ({ searched, setSearched }: SearchBarProps) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) =>
    setSearched(target.value);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <Wrapper onClick={focusInput}>
      <Icon>
        <FontAwesomeIcon icon={faSearch} />
      </Icon>
      <StyledInput
        ref={inputRef}
        onChange={handleChange}
        type="text"
        value={searched}
      />
    </Wrapper>
  );
};
export default SearchBar;
