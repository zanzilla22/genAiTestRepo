import { LoadingCircle } from '../icons';
import React, { useState, useEffect } from 'react';
import UploadFiles_Configure from './UploadFiles_Component';
import { statusToProgress as statusToProgressRecord } from './statusToProgress';

const statusToProgress: Record<string, number> = statusToProgressRecord;

interface WelcomeFormProps {
  assistantDescription: string;
  setAssistantDescription: (description: string) => void;
  assistantModel: string;
  setAssistantModel: (model: string) => void;
  startChatAssistant: () => void;
  isButtonDisabled: boolean;
  isStartLoading: boolean;
  statusMessage: string;
  fileIds: string[];
  setFileIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({
  assistantDescription,
  setAssistantDescription,
  assistantModel,
  setAssistantModel,
  startChatAssistant,
  isButtonDisabled,
  isStartLoading,
  statusMessage,
  fileIds,
  setFileIds,
}) => {

  const [lastProgress, setLastProgress] = useState(0);
  const baseStatusMessage = statusMessage.split(' (')[0];
  let progress = statusToProgress[baseStatusMessage] || 0;

  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  const handleFileIdUpdate = (fileId: string) => {
    console.log("WelcomeForm: New file ID added:", fileId);
    setFileIds(prevFileIds => [...prevFileIds, fileId]);
  };


  const handleActiveFileIdsUpdate = (activeFileIds: string[]) => {
    setFileIds(activeFileIds);
  };


  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  useEffect(() => {
    console.log("Aktive Datei-IDs:", fileIds);
  }, [fileIds]);



  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        <h1 className="text-lg font-semibold text-black">
          Welcome to UTSAA!
        </h1>
        <form className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Enter the specific success criteria that matter to you"
            value={assistantDescription}
            onChange={(e) => setAssistantDescription(e.target.value)}
            required
            className="p-2 border border-gray-200 rounded-md"
            onClick={(e) => setAssistantModel('gpt-4-1106-preview')}
          />
        </form>

        <div className="upload-files-container">
          <UploadFiles_Configure
            onFileIdUpdate={handleFileIdUpdate}
            setActiveFileIds={handleActiveFileIdsUpdate}
          />
        </div>
        {/* Start button in its own container */}
        <div className="flex justify-center p-4">
        <button
  type="button"
  onClick={startChatAssistant}
  disabled={isButtonDisabled || !assistantDescription || fileIds.length === 0|| fileIds.some(fileId => typeof fileId === 'undefined')}
  className="w-full p-2 rounded-md bg-green-500 text-white flex justify-center items-center relative overflow-hidden"
  style={{
    position: 'relative',
    opacity: isButtonDisabled ? 0.5 : 1,
  }}
>
  {isStartLoading && (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: `${progress}%`,
        background: 'rgba(0, 0, 0, 0.2)'
      }}
    />
  )}
  {isStartLoading ? (
    <div className="flex flex-col items-center space-y-2">
      <LoadingCircle />
      <p className="text-sm text-gray-700">{statusMessage}</p>
    </div>
  ) : "Start"}
</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
