import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const oauthUrl = `https://github.com/login/oauth/authorize?allow_signup=false&scope=repo,user&client_id=${process.env.NEXT_PUBLIC_GH_OAUTH_ID}`;

  return (
    <section>
      <p>PRIDEFUL</p>
      <button onClick={() => router.replace(oauthUrl)}>LOGIN with GITHUB</button>
    </section>
  );
}
