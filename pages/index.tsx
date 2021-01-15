import Head from "next/head";
import { Heading, Center, Box, Text, Button } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

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
        <title>Stasty - Sign in</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box w='100%' h='100vh' px={4} py={6} position='relative'>
        <Center>
          <Heading mb={4}>Stasty</Heading>
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        </Center>
      </Box>
    </>
  );
}
