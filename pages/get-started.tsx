import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import getClient from "../prisma-client";
import { IUser } from "../types";
import { FormEvent } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../state";

interface Props {
  user: IUser;
}

export default function GetStarted({ user }: Props) {
  const router = useRouter();
  const { token } = router.query;

  const setUser = useSetRecoilState(userAtom);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userInfo = Object.fromEntries(new FormData(e.target as any));
    const { data: updatedUser } = await axios.post("/api/complete-profile", { data: userInfo, token });

    localStorage.setItem("token", token as string);
    setUser(updatedUser);
    router.replace("/explore");
  };

  return (
    <section>
      {/* show some sort of profile preview too */}

      <form onSubmit={submit}>
        <p className="font-bold">Gender:</p>
        <select name="gender" className="">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <br />

        <input name="title" placeholder="Title" className="border" />

        <br />

        <p>Have a calendly account? why not create a special event and drop a link here?</p>
        <input name="calendly" placeholder="Calendly link" className="border" />

        <br />

        <p>Lifestyle</p>
        <p>[show multiple highlightable categories]</p>

        <br />

        <button type="submit" className="text-white font-bold bg-blue-500">
          Start Exploring ❤️
        </button>
      </form>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token } = query;

  const userId = jwt.verify(token as string, process.env.JWT_SECRET as string) as string;

  const client = await getClient();
  const user = await client.user.findUniqueOrThrow({ where: { id: userId } });

  return {
    props: {
      user,
    },
  };
};