import { Dialog, DialogContent } from '../../ui/dialog';
import CreateProjectForm from './create-project-form';
import useCreateProjectDialog from '../../../hooks/use-create-project-dialog.jsx';

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateProjectDialog();
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0">
        <CreateProjectForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
