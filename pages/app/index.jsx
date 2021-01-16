import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Center,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  VStack,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import { Link as NextLink } from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) {
    return (
      <Modal closeOnOverlayClick={false} isOpen={true} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Expired</ModalHeader>
          <ModalBody>Please signin again.</ModalBody>
          <ModalFooter>
            <Link as={NextLink} to='/'>
              Signin
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Head>
        <title>Stasty - Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <VStack spacing={4}>
        <header>
          <Center>
            <IconButton
              aria-label='Add photo'
              icon={<AddIcon />}
              onClick={() => router.push("/app/add")}
              size='lg'
              mt='3'
              ml='4'
            />
          </Center>
        </header>
        <main>
          <InputGroup maxW='800px' margin='0 auto'>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input type='search' placeholder='Search Terms' w='40rem' />
          </InputGroup>
        </main>
      </VStack>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
}
