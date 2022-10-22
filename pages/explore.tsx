import { User } from "@prisma/client";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import getClient from "../prisma-client";
import { IUser } from "../types";

interface Props {
  user: IUser;
}

export default function Explore({ user }: Props) {
  console.log(user);

  return (
    <section>
      <p>EXPLORE PAGE</p>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  let user: User | null = null;

  try {
    const id = jwt.verify(cookies.get("token") as string, process.env.JWT_SECRET as string) as string;
    const client = await getClient();

    user = await client.user.findUniqueOrThrow({ where: { id } });
  } catch (err) {
    cookies.set("token", null);
    console.log(err);
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: { user },
  };
};
