import React, { useEffect, useState, createRef } from 'react';
import logo from './logo.svg';
import { ChromeMessage, Sender } from './chrome/types';

import './App.css';

const App = () => {
  const [url, setUrl] = useState<string | undefined>('');
  const [responseFromContent, setResponseFromContent] = useState<string>('');
  const inputRef = createRef<HTMLInputElement>();

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setUrl(url);
      });
  }, []);

  /**
   * Send message to the content script
   */
  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: 'Hello from React',
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const currentTabId = tabs[0].id;
        /**
         * Sends a single message to the content script(s) in the specified tab,
         * with an optional callback to run when a response is sent back.
         *
         * The runtime.onMessage event is fired in each content script running
         * in the specified tab for the current extension.
         */
        chrome.tabs.sendMessage(currentTabId as number, message, (response) => {
          setResponseFromContent(response);
        });
      });
  };

  const sendChangeImagesMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: { command: 'change logo', link: inputRef.current?.value },
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const currentTabId = tabs[0].id;
        chrome.tabs.sendMessage(currentTabId as number, message, (response) => {
          setResponseFromContent(response);
        });
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Enter valid img link:</p>
        <input ref={inputRef} value={inputRef.current?.value}></input>
        <button onClick={sendTestMessage}>SEND MESSAGE</button>
        <button onClick={sendChangeImagesMessage}>Change images</button>
        <p>Response from content:</p>
        <p>{responseFromContent}</p>
      </header>
    </div>
  );
};

export default App;
