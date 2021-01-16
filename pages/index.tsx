import { Button, Flex, Heading } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React, { useEffect } from "react";

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Stasty - Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex
        alignItems='center'
        justifyContent='center'
        direction='column'
        h='80vh'
      >
        <Heading mb={4} size='4xl'>
          Stasty
        </Heading>
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      </Flex>
    </>
  );
}
