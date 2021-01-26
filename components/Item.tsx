import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validateKeywords, validateTitle } from "../utils/validation";

export default function Item({
  item,
  handleFullScreenImage,
  handleDeleteItemState,
}) {
  const { imageData, title, _id: id } = item;
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    handleSubmit,
    errors,
    register,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();
  const router = useRouter();

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsEditMode(false);
      router.push("/");
    }
  }, [isSubmitSuccessful]);

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

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsEditMode(true);
  };

  const onEditSubmit = async (values) => {
    values.keywords = values.keywords
      .trim()
      .split(" ")
      .map((word) => word.trim());
    values.itemId = id;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    ).catch((err) => console.error("error posting data: ", err));

    if (response) {
      const data = await response.json();
      return data;
    } else console.error("No response from server");
  };

  const imageUrl = imageData?.secure_url ? imageData.secure_url : "";

  return (
    <>
      <Box
        w='100%'
        margin='0 auto'
        borderWidth='1px'
        borderRadius='lg'
        overflow='hidden'
        marginBottom={4}
        cursor='pointer'
        onClick={(event) => handleFullScreenImage(event, imageData.secure_url)}
      >
        <HStack padding={[2, 0]}>
          <Box
            width='100px'
            height='100px'
            position='relative'
            display={["none", "block"]}
          >
            <Image src={imageUrl} layout='fill' objectFit='cover' alt='' />
          </Box>
          <Heading size='lg'>{title}</Heading>
          <Box
            d='flex'
            flexDir={{ base: "column", sm: "column", md: "row", lg: "row" }}
            alignItems='baseline'
          >
            {item.keywords.map((keyword: string, index: number) => (
              <Badge
                borderRadius='full'
                px='2'
                colorScheme='purple'
                key={index}
                m={1}
                marginBottom={0}
              >
                {keyword}
              </Badge>
            ))}
          </Box>
          <Box
            flex={1}
            marginRight={4}
            display='flex'
            justifyContent='flex-end'
            flexDir={{ base: "column", sm: "column", md: "row", lg: "row" }}
          >
            <IconButton
              marginRight={{ base: 0, sm: 0, md: 4, lg: 4 }}
              marginBottom={{ base: 2, sm: 2, md: 0, lg: 0 }}
              aria-label='edit item'
              icon={<EditIcon />}
              justifySelf='end'
              onClick={(event) => handleEdit(event)}
              alignSelf={{ base: "flex-end", sm: "flex-end", md: "inherit" }}
            />
            <IconButton
              aria-label='delete item'
              icon={<DeleteIcon />}
              justifySelf='end'
              onClick={(event) => handleDelete(event)}
              alignSelf={{ base: "flex-end", sm: "flex-end", md: "inherit" }}
            />
          </Box>
        </HStack>
      </Box>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isEditMode}
        isCentered
        onClose={() => setIsEditMode(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit</ModalHeader>
          <ModalBody>
            <form id='edit-form' onSubmit={handleSubmit(onEditSubmit)}>
              <FormControl id='title' isInvalid={errors.name}>
                <FormLabel>Title</FormLabel>
                <Input
                  name='title'
                  type='text'
                  ref={register({ validate: validateTitle })}
                  defaultValue={item.title}
                  marginBottom={4}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id='keywords'>
                <FormLabel>Keywords</FormLabel>
                <Input
                  name='keywords'
                  type='text'
                  ref={register({ validate: validateKeywords })}
                  defaultValue={item.keywords.join(" ")}
                />
              </FormControl>
              <Button
                type='submit'
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                form='edit-form'
                marginTop={4}
              >
                Submit
              </Button>
            </form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
