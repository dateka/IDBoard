import styled from "@emotion/styled";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useSourceCode } from "common/hooks/useSourceCode";
import { LevelEnriched } from "common/models/level";
import { saveSourceCode } from "common/utils/apiService";
import styles from "global.module.scss";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

type SaveAsDialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const SaveSourceCodeAsDialog = ({
  isOpen,
  setIsOpen,
}: SaveAsDialogProps) => {
  const { data: levels } = useQuery<LevelEnriched[]>("levels");
  const { sourceCode, setSourceCode } = useSourceCode();
  const [levelId, setLevelId] = React.useState<number>(1);
  const [sourceCodeName, setSourceCodeName] = React.useState<string>("");
  const queryClient = useQueryClient();
  const mutation = useMutation(saveSourceCode, {
    onSuccess: (sourceCodeResponse) => {
      queryClient.invalidateQueries("levels");
      setSourceCode(sourceCodeResponse ?? sourceCode);
    },
  });

  React.useEffect(() => {
    if (levels && levels[0]) setLevelId(levels[0].id);
  }, [levels]);

  React.useEffect(() => {
    setSourceCodeName(sourceCode.name);
    setLevelId(sourceCode.levelId);
  }, [sourceCode]);

  const handleSave = () => {
    const newSourceCode = { ...sourceCode, name: sourceCodeName, levelId };
    mutation.mutate(newSourceCode);
    setSourceCode(newSourceCode);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const DialogTitleStyled = styled(DialogTitle)({
    backgroundColor: `${styles.deeperBurgundy}`,
    color: "white",
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitleStyled id="form-dialog-title">Save as...</DialogTitleStyled>
        <DialogContent>
          <DialogContentText>
            Please choose a name and level for your file
          </DialogContentText>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="name">File name</InputLabel>
              <Input
                autoFocus
                fullWidth
                id="name"
                name="name"
                onChange={(event) => setSourceCodeName(event.target.value)}
                value={sourceCodeName}
                aria-describedby="please, input your file name"
              />
            </FormControl>
            <br />
            <FormControl>
              <InputLabel id="level-selector">Choose a level</InputLabel>
              <Select
                onChange={(event) => setLevelId(event.target.value as number)}
                value={levelId}
                defaultValue={levelId}
                name="level-selector"
                id="level-select"
                // disable if sourceCode is not new
                disabled={!!sourceCode.id}
              >
                {levels?.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button onClick={handleSave} color="default">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
