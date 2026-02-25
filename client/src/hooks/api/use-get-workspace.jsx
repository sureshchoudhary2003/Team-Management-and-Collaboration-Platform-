import { useQuery } from "@tanstack/react-query";
import { getWorkspaceByIdQueryFn } from "../../lib/api";

const useGetWorkspaceQuery = (workspaceId) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authorization errors
      if (error?.errorCode === "ACCESS_UNAUTHORIZED") {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !!workspaceId,
  });

  return query;
};

export default useGetWorkspaceQuery;
