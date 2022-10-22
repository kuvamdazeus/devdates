import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import getClient from "../prisma-client";
import { IUser } from "../types";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../state";
import Cookies from "cookies";

interface Props {
  user: IUser;
}

export default function GetStarted({ user }: Props) {
  const router = useRouter();
  const { token } = router.query;

  const setUser = useSetRecoilState(userAtom);

  const [images, setImages] = useState<string[]>([]);

  const uploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log([...(e.target.files as any as File[])]);
    }
  };

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

        <input onChange={uploadFiles} placeholder="Upload images" multiple accept="image/*" type="file" />

        <br />

        <button type="submit" className="text-white font-bold bg-blue-500">
          Start Exploring ❤️
        </button>
      </form>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  const userId = jwt.verify(token as string, process.env.JWT_SECRET as string) as string;

  const client = await getClient();
  const user = await client.user.findUniqueOrThrow({ where: { id: userId } });

  if (!!user.gender && !!user.title)
    return {
      props: {},
      redirect: {
        destination: "/explore",
      },
    };

  return {
    props: {
      user,
    },
  };
};
