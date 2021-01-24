import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
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
import FullScreenImage from "../../components/FullScreenImage";
import Item from "../../components/Item";
import { NextChakraLink } from "../../components/NextChakraLink";
import { connectToDb } from "../../db/database";
import { getAllItems } from "../../db/item";
import { UserSession } from "../../types";
import { debounce } from "../../utils/debounce";

export default function Home({ initialResults }) {
  const [results, setResults] = useState(initialResults || []);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialResults || []);

  const debounceOnChange = React.useCallback(
    debounce(handleSearchTerms, 500),
    []
  );
  const router = useRouter();
  const [session, loading] = useSession();

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
    if (searchTerms && session) {
      const { user } = session;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerms, user }),
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

  const handleFullScreenImage = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    imageUrl: string
  ) => {
    setImageUrl(imageUrl);
    setIsFullScreen(true);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <Head>
        <title>Stasty - Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <VStack spacing={4} position='relative'>
        <header>
          <Center mb={4}>
            <Button
              aria-label='Add photo'
              leftIcon={<AddIcon />}
              onClick={() => router.push("/app/add")}
              size='lg'
              mt='3'
              ml='4'
            >
              Add Image
            </Button>
          </Center>
          <Center>
            <label className='visually-hidden' htmlFor='search'>
              Search
            </label>
            <InputGroup maxW='800px' margin='0 auto'>
              <InputLeftElement
                pointerEvents='none'
                children={<SearchIcon color='gray.300' />}
              />
              <Input
                id='search'
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
        <main style={{ width: "100%", padding: "2rem" }}>
          {results.length < 1 && (
            <Center>
              <Text fontSize='6xl'>No results 😭</Text>
            </Center>
          )}
          {results &&
            results.map((item) => (
              <Item
                key={item._id}
                item={item}
                handleFullScreenImage={handleFullScreenImage}
              />
            ))}
        </main>
        {isFullScreen && (
          <FullScreenImage imageUrl={imageUrl} onClose={handleExitFullScreen} />
        )}
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
