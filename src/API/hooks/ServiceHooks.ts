import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../apiClient";

export const useGetServices = () => {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => ApiClient.getServices(),
  });
  // console.log(query.data);
  return query;
};
