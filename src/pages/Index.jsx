import React, { useEffect, useState, useRef } from 'react';
import { Container, Text, VStack, Button } from "@chakra-ui/react";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const handleRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start();
          setIsRecording(true);

          mediaRecorder.ondataavailable = (event) => {
            const audioBlob = event.data;
            // Pass the audioBlob to the ACRCloud SDK for processing
            console.log('Audio Blob:', audioBlob);
          };
        })
        .catch((err) => {
          console.error('Error accessing microphone', err);
        });
    }
  };

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
        <Button onClick={handleRecord}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
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