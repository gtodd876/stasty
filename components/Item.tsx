import { DeleteIcon } from "@chakra-ui/icons";
import { Badge, Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export default function Item({
  item,
  handleFullScreenImage,
  handleDeleteItemState,
}) {
  const { imageData, title, _id: id } = item;
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const values = { id };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    ).catch((err) => console.error("error posting data: ", err));
    if (response) {
      console.log(response.status);
      if (response.status === 200) {
        handleDeleteItemState(id);
      }
      const data = await response.json();

      await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: imageData.public_id }),
      }).catch((err) => console.error("error posting data: ", err));

      return data;
    } else console.error("No response from server");
  };

  const imageUrl = imageData?.secure_url ? imageData.secure_url : "";
  return (
    <Box
      w='100%'
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      marginBottom={4}
      cursor='pointer'
      onClick={(event) => handleFullScreenImage(event, imageData.secure_url)}
    >
      <HStack>
        <Box width='100px' height='100px' position='relative'>
          <Image src={imageUrl} layout='fill' objectFit='cover' alt='' />
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
        <Box flex={1} textAlign='end' marginRight={4}>
          <IconButton
            aria-label='delete item'
            icon={<DeleteIcon />}
            justifySelf='end'
            onClick={(event) => handleDelete(event)}
          />
        </Box>
      </HStack>
    </Box>
  );
}
