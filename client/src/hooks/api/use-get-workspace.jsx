import { useQuery } from "@tanstack/react-query";
import { getWorkspaceByIdQueryFn } from "../../lib/api";

const useGetWorkspaceQuery = (workspaceId) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export default useGetWorkspaceQuery;
