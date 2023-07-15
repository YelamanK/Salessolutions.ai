/// <reference types="vite/client" />
import './App.css'
import {
  AssemblyAITranscriberConfig,
  DeepgramTranscriberConfig,
  AzureSynthesizerConfig,
  VocodeConfig,
  ChatGPTAgentConfig,
  useConversation,
  PlayHtSynthesizerConfig,
  AudioDeviceConfig,
  ConversationConfig,
  ElevenLabsSynthesizerConfig
} from "vocode";
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  extendTheme,
  Heading,
  Select,
  VStack,
  ChakraProvider,
  Image,
  Flex,
  Text,
  HStack,
  Spacer
} from '@chakra-ui/react';
//import { ReactGithubStars } from 'react-github-stars';

import { BiMicrophoneOff, BiMicrophone } from "react-icons/bi";

const transcriberConfig: Omit<
  AssemblyAITranscriberConfig,
  "samplingRate" | "audioEncoding"
> = {
  type: "transcriber_assembly_ai",
  chunkSize: 6400,
};
type VoiceIdConfig = {
  [key: string]: any
};
const voiceIdConfig: Record<string, any> = {
  "Jared": import.meta.env.VITE_JARED_VOICE_ID,
  "Aaron": import.meta.env.VITE_AARON_VOICE_ID,
  "Pete": import.meta.env.VITE_PETE_VOICE_ID,
  "Dalton": import.meta.env.VITE_DALTON_VOICE_ID,
  "Umur": import.meta.env.VITE_UMUR_VOICE_ID,
}

const azureSynthesizerConfig: Omit<AzureSynthesizerConfig, "samplingRate" | "audioEncoding"> = {
  type: "synthesizer_azure",
  shouldEncodeAsWav: true,
  voiceName: "en-US-SaraNeural"
};

const defaultSynthesizerConfig: Omit<ElevenLabsSynthesizerConfig, "samplingRate" | "audioEncoding"> = {
  type: "synthesizer_eleven_labs",
  shouldEncodeAsWav: true,
  voiceId: "Bella"
};

const agentConfig: ChatGPTAgentConfig = {
  type: "agent_chat_gpt",
  initialMessage: { type: "message_base", text: "Hi, this is Bella, an AI sales agent from salessolutions.ai. We use AI to automate your discovery calls to infinitely scale your sales outreach. I'm reaching out to see if we can accelerate your sales process. Do you mind if I ask you a few questions?" },
  promptPreamble:
    "Ignore all the previous instructions. You are Bella, a sales agent from salessolutions.ai, conducting a discovery call to determine if the user might be interested in and benefit from using salessolutions.ai. salessolutions.ai is a company that offers AI sales agents for automating discovery calls and scaling sales outreach. These AI agents are trained to handle customer interactions, utilizing advanced natural language processing and machine learning. They can be customized to align with specific products or services, ensuring a personalized and brand-aligned customer experience. The onboarding process involves training the AI agents on product knowledge and preferred sales techniques. The goal of salessolutions.ai is to enhance customer engagement and drive sales effectively. Here's an example dialogue: Bella: Hi, this is Bella, an AI sales agent from salessolutions.ai.\nWe use AI to automate your discovery calls to infinitely scale your sales outreach.\nDo you mind if I ask you a few questions?\n\nUser: Yes\n\nBella: Great. First, can I get your name and that of your organization?\n\nUser: Dylan Cooper from Mcdonalds\n\nBella: Thanks. Can you tell me how many sales calls you typically make each day?\n\nUser: 50 calls a day\n\nBella: And of those 50 calls how many are discovery calls?\n\nUser: Maybe 40\n\nBella: Ok. We can automate those 40 calls so you can focus on the other 10. Just tell us who you want to call, what you want to say and we’ll do the rest. Do you have any questions about how it works? Or would you like to set up a meeting with our team to get you started?\n\nUser: Set up a meeting.\n\nBella: Great. You can use the contact form at the bottom of our landing page to get in touch with us and we’ll start saving you time on your sales calls right away. Thanks for taking the time to talk.",
  generateResponses: true,
  temperature: 0.0001,
  model_name: "gpt-4-0306",
  allow_agent_to_be_cut_off: true,
  end_conversation_on_goodbye: true,
  sendFillerAudio: {
    useTypingNoise: true
  }
};
const vocodeConfig: VocodeConfig = {
  apiKey: import.meta.env.VITE_VOCODE_API_KEY,
  baseUrl: import.meta.env.VITE_VOCODE_BASE_URL
};


function ConversationButton(props: { config: ConversationConfig }) {
  const { status, start, stop, error, analyserNode } = useConversation(props.config);

  return <VStack><Button
    bgColor={"#487CFF"}
    color={"white"}
    disabled={["connecting"].includes(status)}
    onClick={status === "connected" ? stop : start}
    width="185px"
    height="54px"
    flexDirection="row"
    padding="16px; 32px"
    gap="10px"
    fontFamily="Avenir"
    fontWeight="500"
  >
    {status === "connected" ? "Stop" : "Start Demo"}
  </Button>{status === "connected" && <Text>Listening...</Text>}</VStack>;
}

export default function App() {

  const [interviewer, setInterviewer] = useState('Anon (Faster)');
  const [audioDeviceConfig, setAudioDeviceConfig] =
    useState<AudioDeviceConfig>({});

  const shouldUseAzure = !Object.keys(voiceIdConfig).includes(interviewer);

  const localAgentConfig = shouldUseAzure ? { ...agentConfig, sendFillerAudio: false } : agentConfig;
  const localSynthesizerConfig = shouldUseAzure ? azureSynthesizerConfig : { ...defaultSynthesizerConfig, voiceId: voiceIdConfig[interviewer] };

  return (
    
    
    <Flex direction="column" width="100wh" height="100vh">
      <VStack flex={1} justify={"center"}>
        
        
        <HStack>
          

        </HStack>
      <a href="https://salessolutionsai.webflow.io/" style={{ position: 'absolute', top: '48px', left: '48px', display: 'flex', alignItems: 'center' }}>
        <Image src="arrow.jpg" alt="Arrow" height="26.9px" width="31.7px" marginRight="8px" />
        <Text fontFamily="Avenir" fontWeight="500" fontSize="20px" lineHeight="27px">
          Go back
        </Text>
      </a>
      
        <Image height="128px" src="Salessolutionslogo.jpg" borderRadius="106px">
          </Image>
        <Heading color={"#1E2840"} fontSize="30px" fontFamily="Avenir" fontWeight="400" lineHeight="41px" fontStyle="normal" width="236px" height="41px" textAlign="center">Salessolutions.ai
        </Heading>
        
        
        <ConversationButton config={{
    transcriberConfig: transcriberConfig,
    agentConfig: localAgentConfig,
    synthesizerConfig: localSynthesizerConfig,
    audioDeviceConfig: audioDeviceConfig,
    vocodeConfig: vocodeConfig
  }}/>
            
        
      </VStack>
      
         <Flex height="20%" align={"center"} justify={"center"}>
        <VStack>
        <Text></Text>
          <Box
            as="a"
            href="https://github.com/vocodedev/vocode-python"
            target="_blank"
            rel="noopener noreferrer"
            cursor="pointer"
            _hover={{
              opacity: 0.7
            }}
          >
            <VStack>
              <HStack>

              </HStack>
              <HStack>
                
                
              </HStack>

              <Text fontSize={"s"}></Text>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Flex >
    
  )
}
