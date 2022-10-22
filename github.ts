import axios from "axios";

const getAxiosForUser = (access_token: string) =>
  axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

export const getUser = async (access_token: string) => {
  const instance = getAxiosForUser(access_token);
  const { data } = await instance.get("/user");

  return data;
};
