import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NextChakraLink } from "../../components/NextChakraLink";

type ImageData = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
};

export default function Add() {
  const hiddenInput = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const {
    handleSubmit,
    errors,
    register,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (isSubmitSuccessful) router.push("/");
  }, [isSubmitSuccessful]);

  async function uploadPhoto(file) {
    const response = await fetch("/api/upload");
    const { signature, timestamp } = await response.json();
    const photoFormData = new FormData();
    photoFormData.append("file", file);
    photoFormData.append("api_key", "631337223918493");
    photoFormData.append("timestamp", timestamp);
    photoFormData.append("signature", signature);
    photoFormData.append("upload_preset", "ml_default");
    const cloudinaryResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dxlknzmt2/image/upload",
      {
        method: "POST",
        body: photoFormData,
      }
    ).catch((err) => console.error(err));
    if (cloudinaryResponse) return cloudinaryResponse.json();
  }

  async function handlePhotoSelect(file) {
    setIsUploading(true);
    const imageData = await uploadPhoto(file);

    if (imageData)
      setImageData({
        public_id: imageData.public_id,
        secure_url: imageData.secure_url,
        width: imageData.width,
        height: imageData.height,
        created_at: imageData.created_at,
      });
    setIsUploading(false);
  }

  async function onSubmit(values) {
    values.imageData = imageData;
    values.user = session.user;
    values.keywords = values.keywords
      .trim()
      .split(" ")
      .map((word) => word.trim());
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/add`,
      {
        method: "POST",
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
  }

  function validateTitle(value) {
    if (!value) {
      return "Title is required";
    } else return true;
  }

  function validateKeywords(value) {
    if (!value) {
      return "Keywords are required";
    } else return true;
  }

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

  return (
    <Box p={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8}>
          <Button
            onClick={() => {
              if (hiddenInput) hiddenInput.current.click();
            }}
            isLoading={isUploading}
          >
            Upload Photo
          </Button>
          <input
            hidden
            type='file'
            ref={hiddenInput}
            onChange={(e) => handlePhotoSelect(e.target.files[0])}
          />
          <FormControl id='title' isInvalid={errors.name}>
            <FormLabel>Title</FormLabel>
            <Input
              name='title'
              type='text'
              ref={register({ validate: validateTitle })}
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
            />
          </FormControl>
          <Button
            type='submit'
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Add
          </Button>
          {imageData && imageData?.secure_url && (
            <Image src={imageData?.secure_url} alt='' />
          )}
        </VStack>
      </form>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
