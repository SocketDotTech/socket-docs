import useSWR from "swr";
import { DEPLOYMENT_URL } from "../../consts";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useDeployments = () => {
  let query = `${DEPLOYMENT_URL}`;

  const { data, error, isValidating, mutate } = useSWR(query, fetcher);

  console.log(data);

  return {
    data: "test",
    error: error,
  };
};
