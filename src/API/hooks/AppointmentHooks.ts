import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../apiClient";

export const useGetAppointments = () => {
  const query = useQuery({
    queryKey: ["appointments"],
    queryFn: () => ApiClient.getAppointments(),
    refetchInterval: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 10,
  });
  // console.log(query.data);
  return query;
};
