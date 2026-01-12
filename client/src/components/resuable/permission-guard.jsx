import React from "react";
import { useAuthContext } from "../../context/auth-provider";
import { Permissions } from "../../constant";

const PermissionsGuard = ({
  children,
  requiredPermission,
  showMessage = false,
}) => {
  const { hasPermission } = useAuthContext();

  if (!hasPermission(requiredPermission)) {
    if (showMessage) {
      return (
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          You don't have permission to view this content.
        </div>
      );
    }
    return null;
  }

  return children;
};

export default PermissionsGuard;
