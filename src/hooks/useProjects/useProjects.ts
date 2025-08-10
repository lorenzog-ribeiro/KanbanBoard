import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./useCase/projects.api";

export function useProjects() {
  const {
    data: projects,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return { projects, isError, isLoading };
}
