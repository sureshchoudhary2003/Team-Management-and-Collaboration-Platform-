import { SidebarTrigger } from "./ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Bell, Settings } from "lucide-react";
import { useAuthContext } from "../context/auth-provider";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "../hooks/use-workspace-id";
import useGetWorkspaceQuery from "../hooks/api/use-get-workspace";
import { toast } from "../hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "../lib/api";

export default function Header() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { data: workspaceData, isLoading: workspaceLoading } = useGetWorkspaceQuery(workspaceId);
  const workspace = workspaceData?.workspace;
  const queryClient = useQueryClient();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleLogout = () => {
    logoutMutate();
  };

  const handleSettingsClick = () => {
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}/settings`);
    }
  };

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "This feature is coming soon!",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <SidebarTrigger />
        </div>
        <div className="mr-4 flex">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/workspace/${workspaceId}`}>Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{workspaceLoading ? "Loading..." : workspace?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleNotificationsClick}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
