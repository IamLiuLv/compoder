'use client';

import React, { useEffect, useState } from 'react';
import { ReactCodeRenderer } from './ReactCodeRenderer';
import { customRequire } from './customRequire';

interface ArtifactData {
  entryFile: string;
  files: {
    [key: string]: string;
  };
}

type MessageType = 'artifacts';

interface MessagePayload {
  type: MessageType;
  data: ArtifactData;
}

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<{
    [key: string]: string;
  }>({});
  const [_, setKey] = useState<number>(0);
  const [entryFile, setEntryFile] = useState<string>('App.tsx');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data }: MessagePayload = event.data;
      if (type === 'artifacts') {
        setEntryFile(data.entryFile);
        setFiles(data.files);
        setKey((prevKey) => prevKey + 1); // Update the key to force remount
      }
    };

    window.addEventListener('message', handleMessage as EventListener);
    window.parent.postMessage('IFRAME_LOADED', '*');
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage as EventListener);
    };
  }, []);

  // Add a function to handle retry events
  const handleError = (errorMessage: string) => {
    // Send error message to parent window
    window.parent.postMessage(
      {
        type: 'artifacts-error',
        errorMessage,
      },
      '*',
    );
  };

  const handleSuccess = () => {
    window.parent.postMessage(
      {
        type: 'artifacts-success',
      },
      '*',
    );
  };

  return (
    <>
      {Object.keys(files).length > 0 && (
        <ReactCodeRenderer
          customRequire={customRequire}
          entryFile={entryFile}
          files={files}
          onError={handleError}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default HomePage;
