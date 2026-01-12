import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import useGetWorkspaceMembers from "../../../hooks/api/use-get-workspace-members";
import useWorkspaceId from "../../../hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "../../../lib/helper";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader className="w-8 h-8 animate-spin place-self-center" />
      ) : (
        <ul role="list" className="space-y-3">
          {members.map((member, index) => {
            const name = member?.userId?.name || "";
            const initials = getAvatarFallbackText(name);
            const avatarColor = getAvatarColor(name);
            return (
              <li key={index} role="listitem" className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.userId?.profilePicture || ""} alt={name} />
                  <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{member.role?.name}</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  Joined {member.joinedAt ? format(member.joinedAt, "PPP") : ""}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentMembers;
