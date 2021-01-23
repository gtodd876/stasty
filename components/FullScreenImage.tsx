import { Box, Image } from "@chakra-ui/react";

export default function FullScreenImage({ imageUrl, onClose }) {
  return (
    <>
      <Box
        width='100%'
        height='100vh'
        position='absolute'
        top={0}
        left={0}
        zIndex={50}
        backgroundColor='#000'
        opacity={0.9}
      ></Box>
      <Image
        src={imageUrl}
        width='100%'
        height='100%'
        position='absolute'
        top={0}
        left={0}
        zIndex={75}
        fit='contain'
      />
      <Box
        cursor='pointer'
        onClick={() => onClose()}
        fontSize='24px'
        position='absolute'
        top='32px'
        right='32px'
        zIndex={100}
        color='white'
      >
        X
      </Box>
    </>
  );
}
