import { getCurrentUserQueryFn } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const token = localStorage.getItem("accessToken");
  
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    enabled: !!token, // Only run query if token exists
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  return query;
};

export default useAuth;
