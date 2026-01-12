import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";

const useConfirmDialog = () => {
  const [open, setOpen] = useQueryState(
    "confirm-dialog",
    parseAsBoolean.withDefault(false)
  );
  const [context, setContext] = useState(null);

  const onOpenDialog = (data = null) => {
    setContext(data);
    setOpen(true);
  };

  const onCloseDialog = () => {
    setContext(null);
    setOpen(false);
  };

  return {
    open,
    context,
    onOpenDialog,
    onCloseDialog,
  };
};

export default useConfirmDialog;
