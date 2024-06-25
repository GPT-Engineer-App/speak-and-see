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

          mediaRecorder.ondataavailable = async (event) => {
            const audioBlob = event.data;
            console.log('Audio Blob:', audioBlob);

            // Convert the audioBlob to a file
            const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

            // Prepare the form data
            const formData = new FormData();
            formData.append('sample', audioFile);
            formData.append('access_key', 'YOUR_ACCESS_KEY');
            formData.append('data_type', 'audio');
            formData.append('signature_version', '1');
            formData.append('timestamp', Math.floor(Date.now() / 1000));

            // Generate the signature
            const stringToSign = `POST\n/v1/identify\n${formData.get('access_key')}\n${formData.get('data_type')}\n${formData.get('signature_version')}\n${formData.get('timestamp')}`;
            const signature = CryptoJS.HmacSHA1(stringToSign, 'YOUR_SECRET_KEY').toString(CryptoJS.enc.Base64);
            formData.append('signature', signature);

            // Send the request to ACRCloud
            try {
              const response = await fetch('https://identify-eu-west-1.acrcloud.com/v1/identify', {
                method: 'POST',
                body: formData
              });

              const result = await response.json();
              console.log('ACRCloud Response:', result);
            } catch (error) {
              console.error('Error identifying audio:', error);
            }
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