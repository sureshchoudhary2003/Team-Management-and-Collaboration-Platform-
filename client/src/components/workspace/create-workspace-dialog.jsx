import { Dialog, DialogContent } from '../ui/dialog';
import CreateWorkspaceForm from './create-workspace-form';
import useCreateWorkspaceDialog from '../../hooks/use-create-workspace-dialog.jsx';

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateWorkspaceDialog();
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0">
        <CreateWorkspaceForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
