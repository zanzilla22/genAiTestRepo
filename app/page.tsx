// app/page.tsx
"use client"; // This line indicates that the component is a Client Component


import React, { useState, useEffect } from 'react';
import LinkBar from './components/LinkBar'; // Adjust the import path as necessary
import Papa from 'papaparse';
import { useChatState, useChatManager, useStartAssistant } from './hooks';
import { MessageList, WelcomeForm, InputForm } from './components';


const DbTest = () => {
  // chatgpt presets
  const {
    // assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    isButtonDisabled, setIsButtonDisabled,
    files = [], setFiles,
    isStartLoading, setStartLoading,
    statusMessage, setStatusMessage,
    isSending, setIsSending,
    inputRef,
    formRef,
    initialThreadMessage,
    setInitialThreadMessage,
    setChatStarted,
    chatStarted: chatHasStarted,
    chatManager, setChatManager,
    assistantId,
    isMessageLoading, setIsMessageLoading,
    progress, setProgress,
    isLoadingFirstMessage,
    setIsLoadingFirstMessage,
    chatUploadedFiles = [], setChatUploadedFiles,
    chatFileDetails, setChatFileDetails,
    fileIds, setFileIds,
  } = useChatState();

  const [trigger, setTrigger] = useState(false);
  const [firstMessage, setFirstMessage] = useState("Hello");
  // ...other state declarations

  // Call custom hooks at the top level
  useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
  useStartAssistant(assistantId, chatManager, firstMessage);




    useEffect(() => {
    if (trigger) {

        const startChatAssistant = async () => {
          setIsButtonDisabled(true);
          setStartLoading(true);
          if (chatManager) {
            try {
              console.log('Starting assistant with the following parameters:');
              // console.log('Assistant Name:', assistantName);
              console.log('Assistant Model:', assistantModel);
              console.log('Assistant Description:', assistantDescription);
              console.log('File IDs:', fileIds);
              console.log('Initial Thread Message:', firstMessage);

              await chatManager.startAssistant({ assistantModel, assistantDescription }, fileIds, initialThreadMessage);

              console.log('Assistant started:', chatManager.getChatState());
              setChatStarted(true);
            } catch (error) {
              console.error('Error starting assistant:', error);
              if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
            } finally {
              setIsButtonDisabled(false);
              setStartLoading(false);
            }
          }
        };
        if (chatManager) {
            console.log(chatManager.messages);
        } else {
            console.log('chatManager is not initialized');
        }    // end of gpt initialization
      setTrigger(false);
    }
  }, [trigger]);

  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      complete: (result) => {
        // The parsed content is in result.data
        for (let i = 0; i < result.data.length; i++) {
          console.log(result.data[i]);

          const msg = "Summarize the following idea: " + result.data[i]["solution"];
          setFirstMessage(msg);
          setTrigger(true);
        }

        // Process your data here
        // You can setOutput or perform other actions based on the parsed data
      },
      header: true,  // Assuming your CSV has a header row
      skipEmptyLines: true,
      dynamicTyping: true,
      error: (error) => {
        console.error('Error parsing CSV:', error);
        // Handle parsing error here
      }
    });
  };

  const processFile = () => {
    // Process the file and set the output
    setOutput('Processed file content');
  };

  return (

    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      <LinkBar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>DB Test Page</h1>
        <input type="file" onChange={handleFileChange} style={{ display: 'block', margin: '20px auto' }} />
        <button onClick={processFile} style={{ display: 'block', margin: '10px auto' }}>Process File</button>
        <div style={{ marginTop: '20px' }}>
          <h2>Output:</h2>
          <p>{output}</p>
        </div>
      </div>
      {chatHasStarted || assistantId || isLoadingFirstMessage  ? (
        <MessageList chatMessages={chatMessages} statusMessage={statusMessage} isSending={isSending} progress={progress} isFirstMessage={isLoadingFirstMessage} fileDetails={chatFileDetails} />
      ) : (
        <WelcomeForm {...{assistantName, setAssistantName, assistantDescription, setAssistantDescription, assistantModel, setAssistantModel, startChatAssistant, isButtonDisabled, isStartLoading, statusMessage, fileIds, setFileIds}} />
      )}
      <InputForm {...{input: inputmessage, setInput: setInputmessage, inputRef, formRef, disabled: isButtonDisabled || !chatManager, chatStarted: chatMessages.length > 0, isSending, isLoading: isMessageLoading, chatUploadedFiles, setChatUploadedFiles, chatFileDetails, setChatFileDetails, chatManager, setChatStarted, setChatMessages, setStatusMessage, setIsSending, setProgress, setIsLoadingFirstMessage}} />

    </main>
  );
};

export default DbTest;
