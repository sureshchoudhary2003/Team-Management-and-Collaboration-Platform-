import { ChevronDown, Loader } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { getAvatarColor, getAvatarFallbackText } from '../../../lib/helper';
import { useAuthContext } from '../../../context/auth-provider';
import useWorkspaceId from '../../../hooks/use-workspace-id';
import useGetWorkspaceMembers from '../../../hooks/api/use-get-workspace-members';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeWorkspaceMemberRoleMutationFn } from '../../../lib/api';
import { toast } from '../../../hooks/use-toast';
import { Permissions } from '../../../constant';
import PermissionsGuard from "../../resuable/permission-guard";

const AllMembers = () => {
  const { user, hasPermission } = useAuthContext();

  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetWorkspaceMembers(workspaceId);
  const members = data?.members || [];
  const roles = data?.roles || [];

  const { mutate: changeRole, isPending: isChanging } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId, memberId) => {
    if (!roleId || !memberId) return;
    const payload = { workspaceId, data: { roleId, memberId } };
    changeRole(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
        toast({ title: "Success", description: "Member's role changed successfully", variant: "success" });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  if (isPending) {
    return <Loader className="w-8 h-8 animate-spin place-self-center" />;
  }

  return (
    <div className="grid gap-6 pt-2">
      {members.map((member) => {
        const name = member.userId?.name || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        const memberId = member.userId?._id;
        return (
          <div key={memberId} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.userId?.profilePicture || ""} alt="Image" />
                <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{member.userId?.email}</p>
              </div>
            </div>
            <PermissionsGuard requiredPermission={Permissions.CHANGE_MEMBER_ROLE}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto min-w-24 capitalize"
                    disabled={isChanging || member.userId._id === user?._id}
                  >
                    {member.role?.name?.toLowerCase()}
                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {roles
                    .filter((role) => role.name !== "OWNER")
                    .map((role) => (
                      <DropdownMenuItem
                        key={role._id}
                        onClick={() => handleSelect(role._id, memberId)}
                        disabled={isChanging}
                        className="capitalize cursor-pointer"
                      >
                        {role.name?.toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionsGuard>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;
