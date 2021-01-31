import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorMode,
  VStack,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { dehydrate } from "react-query/hydration";
import FullScreenImage from "../../components/FullScreenImage";
import Item from "../../components/Item";
import { NextChakraLink } from "../../components/NextChakraLink";
import { connectToDb } from "../../db/database";
import { getAllItems } from "../../db/item";
import { debounce } from "../../utils/debounce";

export default function Home() {
  const [searchTerms, setSearchTerms] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const closeIconRef = React.useRef(null);

  const router = useRouter();
  const [session, loading] = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const itemRef = React.createRef<HTMLDivElement | null>();
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

  const fetcher = () =>
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/items`).then((res) =>
      res.json()
    );

  const { data, isError, isLoading, isFetching } = useQuery("items", fetcher);
  const queryClient = useQueryClient();
  const mutation = useMutation(handleSearchTerms, {
    onSuccess: (data) => queryClient.setQueryData("items", data),
  });
  const debounceOnChange = React.useCallback(
    debounce(mutation.mutate, 500),
    []
  );
  async function handleSearchTerms(searchTerms: string) {
    const { user } = session;
    if (searchTerms && session) {
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
        const results = await response.json();
        return results;
      }
    } else if (!searchTerms && session) {
      queryClient.invalidateQueries("items");
    }
  }

  const handleFullScreenImage = (
    event: React.MouseEvent<HTMLDivElement>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setImageUrl(imageUrl);
    setIsFullScreen(true);
  };

  const handleFullScreenImageKeyNav = (
    event: React.KeyboardEvent<HTMLDivElement>,
    imageUrl: string
  ) => {
    if (event.code === "Space" || event.code === "Enter") {
      setImageUrl(imageUrl);
      setIsFullScreen(true);
    }
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
    if (itemRef) {
      itemRef.current.focus();
    }
  };

  const handleExitFullScreenKeyDown = (event) => {
    event.preventDefault();
    if (event.code === "Space" || event.code === "Enter") {
      setIsFullScreen(false);
      if (itemRef) {
        itemRef.current.focus();
      }
    }
  };

  if (isError) {
    return <div>there is an error</div>;
  }

  if (isLoading) {
    return <div>is loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Stasty - Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <VStack spacing={4} position='relative' maxWidth='1200px' margin='0 auto'>
        <header>
          <FormControl position='absolute' top={3} left={8} display='flex'>
            <FormLabel htmlFor='color-mode'>
              Toggle {colorMode === "light" ? "Dark" : "Light"}
            </FormLabel>
            <Switch id='color-mode' onChange={toggleColorMode} size='lg' />
          </FormControl>
          <Center mb={4}>
            {isFetching && <Spinner size='sm' />}
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
          {session && session.user && session.user.image && (
            <Image
              src={session.user.image}
              width='46px'
              height='46px'
              borderRadius='50%'
              zIndex={5}
              boxShadow='1px 1px 6px 1px rgba(0, 0, 0, 0.25);'
              position='absolute'
              top={3}
              right={8}
            />
          )}
          <Center>
            <label className='visually-hidden' htmlFor='search'>
              Search
            </label>
            <InputGroup maxW='1200px' minW='350px' margin='0 auto'>
              <InputLeftElement
                pointerEvents='none'
                children={<SearchIcon color='gray.300' />}
              />
              <Input
                id='search'
                type='search'
                placeholder='Search Terms'
                onChange={(event) => {
                  setSearchTerms(event.currentTarget.value);
                  debounceOnChange(event.currentTarget.value);
                }}
              />
            </InputGroup>
          </Center>
        </header>
        <main style={{ width: "100%", padding: "2rem" }}>
          {data && data?.length < 1 && searchTerms !== "" && (
            <Center>
              <Text fontSize='6xl'>No results 😭</Text>
            </Center>
          )}
          {!isLoading &&
            !isError &&
            data.map((item) => (
              <Item
                key={item._id}
                item={item}
                handleFullScreenImage={handleFullScreenImage}
                handleFullScreenImageKeyNav={handleFullScreenImageKeyNav}
                itemRef={itemRef}
              />
            ))}
        </main>
        {isFullScreen && (
          <FullScreenImage
            itemRef={itemRef}
            imageUrl={imageUrl}
            onClose={handleExitFullScreen}
            closeIconRef={closeIconRef}
            isFullScreen={isFullScreen}
            onCloseKeyDown={handleExitFullScreenKeyDown}
          />
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
  const { db } = await connectToDb();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("items", () =>
    getAllItems(db, session.user.id)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
