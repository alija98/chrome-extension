import { ChromeMessage, Sender } from './types';

type MessageResponse = (response?: any) => void;

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  console.log('[content.js]. Message received', {
    message,
    sender,
  });

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.message === 'Hello from React'
  ) {
    response('Hello from content.js');
  }

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.message.command === 'change logo'
  ) {
    const allImgs = document.getElementsByTagName('img');
    for (let i = 0; i < allImgs.length; i++) {
      allImgs[i].src =
        message.message.link && message.message.link.length > 0
          ? message.message.link
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png';
      allImgs[i].style.objectFit = 'contain';
    }
  }
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
