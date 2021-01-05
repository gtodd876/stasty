import Head from "next/head";
import {
  Heading,
  Center,
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

export default function Home() {
  return (
    <Box w='100%' h='100vh' px={4} py={6} position='relative'>
      <Head>
        <title>Stasty</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header>
        <Center>
          <Heading mb={4}>Stasty</Heading>
        </Center>
      </header>
      <main>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input type='tel' placeholder='Search Terms' />
        </InputGroup>
      </main>
      <IconButton
        aria-label='Add photo'
        icon={<AddIcon />}
        position='fixed'
        bottom={4}
        left={4}
        zIndex={10}
      />
    </Box>
  );
}
