import { INewUser } from "../../../api-types/authentication.types";

export const registerUser = async (userData: INewUser): Promise<void> => {
  // const baseUrl =
  //   process.env.NODE_ENV === "development"
  //     ? process.env.BASE_URL
  //     : window.location.origin;
  // console.log(process.env.BASE_URL);

  await fetch(`http://localhost:5500/api/register`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};
