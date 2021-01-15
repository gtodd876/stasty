import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Center,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Stasty - Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <VStack spacing={4}>
        <header>
          <Center>
            <Heading as='h1' size='4xl'>
              Stasty
            </Heading>
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
