import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Center,
  Code,
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
import { getAllItems } from "../../db/item";
import { connectToDb } from "../../db/database";

export default function Home({ allItems }) {
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
          <Center mb={4}>
            <IconButton
              aria-label='Add photo'
              icon={<AddIcon />}
              onClick={() => router.push("/app/add")}
              size='lg'
              mt='3'
              ml='4'
            />
          </Center>
          <Center>
            <InputGroup maxW='800px' margin='0 auto'>
              <InputLeftElement
                pointerEvents='none'
                children={<SearchIcon color='gray.300' />}
              />
              <Input type='search' placeholder='Search Terms' w='40rem' />
            </InputGroup>
          </Center>
        </header>
        <main>
          {allItems &&
            allItems.map((item) => (
              <Center>
                <pre key={item._id}>{JSON.stringify(item, null, 2)}</pre>
              </Center>
            ))}
        </main>
      </VStack>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      props: { session },
    };
  }
  const props = {};
  const { db } = await connectToDb();
  props.allItems = (await getAllItems(db, session.user.id)) || [];
  return {
    props,
  };
}
