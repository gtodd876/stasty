import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Center,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { NextChakraLink } from "../../components/NextChakraLink";
import { connectToDb } from "../../db/database";
import { getAllItems } from "../../db/item";
import { debounce } from "../../utils/debounce";

export default function Home({ initialResults }) {
  const [results, setResults] = useState(initialResults || []);
  const debounceOnChange = React.useCallback(
    debounce(handleSearchTerms, 500),
    []
  );
  const router = useRouter();
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) {
    return (
      <Modal
        closeOnOverlayClick={false}
        isOpen={true}
        isCentered
        onClose={() => router.push("/")}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Expired</ModalHeader>
          <ModalBody>Please signin again.</ModalBody>
          <ModalFooter>
            <NextChakraLink href='/' as='/'>
              Signin
            </NextChakraLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  async function handleSearchTerms(searchTerms: string) {
    if (searchTerms) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerms }),
        }
      ).catch((err) => console.error("error posting data: ", err));
      if (response) {
        const data = await response.json();
        setResults(data);
      } else console.error("No response from server");
    } else {
      setResults(initialResults);
    }
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
              <Input
                type='search'
                placeholder='Search Terms'
                w='40rem'
                onChange={(event) =>
                  debounceOnChange(event.currentTarget.value)
                }
              />
            </InputGroup>
          </Center>
        </header>
        <main>
          {results.length < 1 && (
            <Center>
              <Text fontSize='6xl'>No results 😭</Text>
            </Center>
          )}
          {results &&
            results.map((item) => (
              <Center key={item._id}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </Center>
            ))}
        </main>
      </VStack>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session: any = await getSession(ctx);
  if (!session) {
    return {
      props: { session },
    };
  }
  const props: any = {};
  const { db } = await connectToDb();
  props.initialResults = (await getAllItems(db, session.user.id)) || [];
  return {
    props,
  };
}
