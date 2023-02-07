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
    message.message === 'delete logo'
  ) {
    const logoToReplace = document.getElementsByClassName(
      ' ls-is-cached lazyloaded'
    );
    const reactLogo = document.createElement('img');
    reactLogo.src =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K';
    logoToReplace[0]?.replaceWith(reactLogo);
  }
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
