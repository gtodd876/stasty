import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

export default function Add() {
  const hiddenInput = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function uploadPhoto(file) {
    const response = await fetch("/api/upload");
    const { signature, timestamp } = await response.json();
    console.log({ signature, timestamp });
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
    if (imageData && imageData.secure_url) setImageUrl(imageData.secure_url);
    console.log(imageData);
    setIsUploading(false);
  }

  return (
    <Box p={8}>
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
        <FormControl id='email'>
          <FormLabel>Title</FormLabel>
          <Input type='text' />
        </FormControl>
        <FormControl id='keywords'>
          <FormLabel>Keywords</FormLabel>
          <Input type='text' />
        </FormControl>
        <Button onClick={(e) => console.log(e)}>Submit</Button>
        {imageUrl && <Image src={imageUrl} alt='' />}
      </VStack>
    </Box>
  );
}
