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
            // Pass the audioBlob to the ACRCloud API for processing
            processAudioWithACRCloud(audioBlob);
          };
        })
        .catch((err) => {
          console.error('Error accessing microphone', err);
        });
    }
  };

  const processAudioWithACRCloud = (audioBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      const data = {
        sample: base64Audio,
        access_key: 'YOUR_ACRCLOUD_ACCESS_KEY',
        data_type: 'audio',
        signature_version: '1',
        sample_bytes: audioBlob.size
      };

      const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

      fetch('https://identify-eu-west-1.acrcloud.com/v1/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      })
      .then(response => response.json())
      .then(result => {
        console.log('ACRCloud Result:', result);
      })
      .catch(error => {
        console.error('ACRCloud Error:', error);
      });
    };
    reader.readAsDataURL(audioBlob);
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