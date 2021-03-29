import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { LevelEnriched } from "common/models/level";
import { SourceCode as SourceCodeType } from "common/models/sourceCode";
import { firstCharToUppercase } from "common/utils/stringUtils";
import React from "react";
import SourceCode from "./SourceCode";
import styles from "./style.module.scss";

//const ShowScroll = styled.div({
//  backgroundColor: `${styles.deeperBurgundy}`
// });

// const Wrapper = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   padding: "20px 0",
//   marginRight: "2px",
// });

// const Level = styled.div({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   cursor: "pointer",
//   fontWeight: "bold",
// });

// const Title = styled.div({
//   marginLeft: "10px",
// });

// const SourceCodes = styled.div({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-end",
//   maxHeight: `${styles.sourceCodesMaxHeight}`,
//   overflowY: "scroll",
//   paddingRight: "2px",

//   "& *": {
//     width: "100%",
//     minHeight: "30px",
//   },
// });

// const Hide = styled.div({
//   maxHeight: '0',
//   transition: 'max-height 0.25s ease-in-out',
//   "&::-webkit-scrollbar-thumb": {
//     backgroundColor: `${styles.veryLightGreen}`
//   },
// });

// const Expand = styled.div({
//   maxHeight: `${styles.sourceCodesMaxHeight}`,
//   transition: 'max-height 0.25s ease-in-out',
//   "&::-webkit-scrollbar-thumb": {
//     backgroundColor: `${styles.veryLightGreen}`
//   },
// });

type LevelProps = {
  level: LevelEnriched;
  searched: string;
};

const Level = ({ level, searched }: LevelProps) => {
  const [expand, setExpand] = React.useState(!!searched);
  const sourceCodesWrapper = React.useRef<HTMLDivElement>(null);

  const sourceCodes: SourceCodeType[] = searched
    ? level.sourceCodes.filter((sourceCode) =>
        sourceCode.name.toLowerCase().includes(searched.toLowerCase())
      )
    : level.sourceCodes;

  const expandLevel = (expand: boolean) => {
    setExpand(expand);
    expand
      ? setTimeout(() => {
          const wrapper = sourceCodesWrapper.current as HTMLDivElement;
          wrapper && wrapper.classList.add(styles.showScroll);
        }, 250)
      : (sourceCodesWrapper.current as HTMLDivElement).classList.remove(
          styles.showScroll
        );
  };

  React.useEffect(() => {
    expandLevel(!!searched);
  }, [searched]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.level} onClick={() => expandLevel(!expand)}>
        <div className={styles.title}>{firstCharToUppercase(level.name)}</div>
        <FontAwesomeIcon icon={!expand ? faCaretRight : faCaretDown} />
      </div>

      <div
        ref={sourceCodesWrapper}
        className={classNames(
          styles.sourceCodes,
          expand ? styles.expand : styles.hide
        )}
      >
        {sourceCodes &&
          sourceCodes.map((sourceCode) => {
            return <SourceCode key={sourceCode.id} sourceCode={sourceCode} />;
          })}
      </div>
    </div>
  );
};

export default Level;
