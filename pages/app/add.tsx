import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

export default function Add() {
  return (
    <Box
      w='100%'
      h='100vh'
      px={4}
      py={6}
      position='relative'
      maxW='1200px'
      margin='0 auto'
    >
      <FormControl id='email'>
        <FormLabel>Title</FormLabel>
        <Input type='text' />
      </FormControl>
    </Box>
  );
}
