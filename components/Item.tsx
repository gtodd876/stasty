import { Box, HStack, Heading, Badge } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";

export default function Item({ item, handleFullScreenImage }) {
  const { imageUrl, title } = item;
  return (
    <Box
      w='100%'
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      marginBottom={4}
      cursor='pointer'
      onClick={(event) => handleFullScreenImage(event, imageUrl)}
    >
      <HStack>
        <Box width='100px' height='100px' position='relative'>
          <Image src={imageUrl} layout='fill' objectFit='cover' />
        </Box>
        <Heading size='lg'>{title}</Heading>
        <Box d='flex' flexDir='row' alignItems='baseline'>
          {item.keywords.map((keyword: string, index: number) => (
            <Badge
              borderRadius='full'
              px='2'
              colorScheme='teal'
              key={index}
              m={1}
              marginBottom={0}
            >
              {keyword}
            </Badge>
          ))}
        </Box>
      </HStack>
    </Box>
  );
}
