import React, { useEffect } from 'react';
import { Container, Text, VStack, Button } from "@chakra-ui/react";

const Index = () => {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log('Permissions granted');
        // Do something with the stream
      })
      .catch((err) => {
        console.error('Permissions denied', err);
      });
  }, []);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Microphone and Video Permission Extension</Text>
        <Text>This extension requests permissions to use the microphone and video.</Text>
        <Button onClick={() => {
          navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((stream) => {
              console.log('Permissions granted');
              // Do something with the stream
            })
            .catch((err) => {
              console.error('Permissions denied', err);
            });
        }}>Request Permissions</Button>
      </VStack>
    </Container>
  );
};

export default Index;