import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import getClient from "../prisma-client";
import { signInWithCustomToken } from "firebase/auth";
import { IUser } from "../types";
import { userAtom } from "../state";
import Cookies from "cookies";
import { auth, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";

interface Props {
  user: IUser;
}

export default function GetStarted({ user }: Props) {
  const router = useRouter();
  const { token } = router.query;

  const setUser = useSetRecoilState(userAtom);

  const [images, setImages] = useState<string[]>([]);
  const [rawFiles, setRawFiles] = useState<FileList | null>(null);

  const uploadFiles = async () => {
    if (rawFiles && rawFiles.length > 0) {
      const hostedImageUrls = await Promise.all(
        [...(rawFiles as any as File[])].map(async (image) => {
          const imageId = `${Math.round(Math.random() * Math.pow(10, 16))}_${image.name}`;

          const storageRef = ref(storage, `user_images/${imageId}`);

          const arrBuf = await image.arrayBuffer();
          await uploadBytes(storageRef, arrBuf, {
            contentType: `image/${image.name.split(".").at(-1)}`,
          });

          return `https://firebasestorage.googleapis.com/v0/b/devdates101.appspot.com/o/user_images%2F${imageId}`;
        })
      );

      setImages(hostedImageUrls);
      return hostedImageUrls;
    } else return [];
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hostedImageUrls = await uploadFiles();

    const userInfo = Object.fromEntries(new FormData(e.target as any));
    const { data: updatedUser } = await axios.post("/api/complete-profile", {
      data: { images: [...user.images, ...hostedImageUrls], ...userInfo },
      token,
    });

    localStorage.setItem("token", token as string);
    setUser(updatedUser);
    router.replace("/explore");
  };

  useEffect(() => {
    async function firebaseSignIn() {
      const { data } = await axios.get("/api/get-auth-jwt");
      await signInWithCustomToken(auth, data.token);
    }

    firebaseSignIn();
  }, []);

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

        <input
          onChange={(e) => setRawFiles(e.target.files)}
          placeholder="Upload images"
          multiple
          accept="image/*"
          type="file"
        />

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
