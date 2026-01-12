import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth-provider";

const WorkspaceRedirect = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.currentWorkspace) {
      navigate(`/workspace/${user.currentWorkspace}`, { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default WorkspaceRedirect; 