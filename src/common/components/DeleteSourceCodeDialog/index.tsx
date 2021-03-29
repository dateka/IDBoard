import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useSourceCode } from "common/hooks/useSourceCode";
import { initSourceCode } from "common/models/sourceCode";
import { deleteSourceCode } from "common/utils/apiService";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

type SaveAsDialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const DeleteSourceCodeDialog = ({
  isOpen,
  setIsOpen,
}: SaveAsDialogProps) => {
  const { sourceCode, setSourceCode } = useSourceCode();
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteSourceCode, {
    onSuccess: () => {
      queryClient.invalidateQueries("levels");
    },
  });

  const handleConfirm = () => {
    mutation.mutate(sourceCode);
    setSourceCode(initSourceCode);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Source code deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm deletion of source code</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
