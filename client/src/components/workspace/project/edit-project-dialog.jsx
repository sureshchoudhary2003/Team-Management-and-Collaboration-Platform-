import { Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import EditProjectForm from "./edit-project-form";
import { useState } from "react";

const EditProjectDialog = ({ project, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="mt-1.5">
          {children || <Edit3 className="w-5 h-5" />}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0">
        <EditProjectForm project={project} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
