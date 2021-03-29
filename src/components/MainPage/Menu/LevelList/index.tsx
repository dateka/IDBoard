import styled from "@emotion/styled";
import { CircularProgress } from "@material-ui/core";
import { LevelEnriched } from "common/models/level";
import { getLevels } from "common/utils/apiService";
import React from "react";
import { useQuery } from "react-query";
import globalStyles from "global.module.scss";
import Level from "./Level";

const StyledLevels = styled.div({
  borderBottom: `1px solid ${globalStyles.deeperBurgundy}`,

  "&:last-of-type": {
    borderBottom: "none",
  },
});

const StyledWrapper = styled.div({
  overflowY: "auto",
  marginRight: "2px",
  height: "100%",
  "&:*": {
    color: `${globalStyles.deeperBurgundy}`,
  },
  "&::-webkit-scrollbar": {
    width: `${globalStyles.widthScrollbar}`,
    boxShadow: "inset 0 0 0",
    borderRadius: `${globalStyles.radius}`,
  },
  "&::-webkit-scrollbar-thumb": {
    background: `${globalStyles.deeperBurgundy}`,
    borderRadius: `${globalStyles.radius}`,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: `${globalStyles.deeperBurgundy}`,
  },
});

type LevelListProps = {
  searched: string;
};

const LevelList = ({ searched }: LevelListProps) => {
  const { data: levels, isLoading } = useQuery<LevelEnriched[]>(
    "levels",
    getLevels
  );

  // const isSearched = (level: LevelEnriched): boolean => {
  //   return (
  //     level.sourceCodes.find((sourceCode) =>
  //       sourceCode.name.toLowerCase().includes(searched.toLowerCase())
  //     ) !== undefined
  //   );
  // };

  if (isLoading || !levels) return <CircularProgress />;

  return (
    <StyledWrapper>
      {levels
        // .filter((level) => isSearched(level))
        .map((level) => {
          return (
            <StyledLevels key={level.id}>
              <Level level={level} searched={searched} />
            </StyledLevels>
          );
        })}
    </StyledWrapper>
  );
};

export default LevelList;
