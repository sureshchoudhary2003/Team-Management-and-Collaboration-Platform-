import { Dialog, DialogContent } from '../../ui/dialog';
import EditTaskForm from "./edit-task-form";

const EditTaskDialog = ({ task, isOpen, onClose }) => {
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
        <EditTaskForm task={task} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
