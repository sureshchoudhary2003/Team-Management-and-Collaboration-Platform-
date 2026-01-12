import { Separator } from "../../components/ui/separator.jsx";
import InviteMember from "../../components/workspace/member/invite-member.jsx";
import AllMembers from "../../components/workspace/member/all-members.jsx";
import WorkspaceHeader from "../../components/workspace/common/workspace-header.jsx";

export default function Members() {
  return (
    <div className="w-full h-auto pt-2">
      <WorkspaceHeader />
      <Separator className="my-4 " />
      <div className="w-full max-w-3xl mx-auto pt-3">
        <h2 className="text-lg leading-[30px] font-semibold mb-1">
          Workspace members
        </h2>
        <p className="text-sm text-muted-foreground">
          Workspace members can view and join all Workspace project, tasks
          and create new task in the Workspace.
        </p>
        <Separator className="my-4" />
        <InviteMember />
        <Separator className="my-4 !h-[0.5px]" />
        <AllMembers />
      </div>
    </div>
  );
}
