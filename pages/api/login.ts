import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { getUser } from "../../github";
import { GithubUser } from "../../types";
import getClient from "../../prisma-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  try {
    const { data } = await axios.post("https://github.com/login/oauth/access_token", {
      code,
      client_id: process.env.NEXT_PUBLIC_GH_OAUTH_ID,
      client_secret: process.env.GH_OAUTH_SECRET,
      redirect_uri: process.env.GH_REDIRECT_URI,
    });

    const access_token = data.split("&")[0].split("=")[1];
    const githubUser = (await getUser(access_token)) as GithubUser;
    const {
      name,
      avatar_url,
      bio,
      blog: website,
      html_url: profile_url,
      email,
      login: username,
    } = githubUser;

    const client = await getClient();
    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    const cookies = new Cookies(req, res);

    if (!!existingUser) {
      cookies.set("token", jwt.sign(existingUser.id, process.env.JWT_SECRET as string));
      return res.redirect("/explore");
    }

    const newUser = await client.user.create({
      data: {
        name,
        email,
        username,
        bio,
        images: [avatar_url],
        profile_url,
        website,
      },
    });

    cookies.set("token", jwt.sign(newUser.id, process.env.JWT_SECRET as string));
    return res.redirect("/get-started");
  } catch (err) {
    console.log(err);
    return res.status(401).send("");
  }
}
