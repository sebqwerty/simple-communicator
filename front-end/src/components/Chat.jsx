import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import MessageForm from './MessageForm';
import AddUserForm from './AddUserForm';
import { useEffect, useState } from 'react';
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState(undefined);

  if (localStorage.getItem("userId") === null) {
    window.location.replace("/");
  } 

  useEffect(() => getMessages().then(response => {
    const messages = response.data.messages;
    setMessages(messages);
  }), [])

  const getMessages = async () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return await axios
      .get(
        `http://127.0.0.1:5000/getLastMessages/${localStorage.getItem("chatId")}/40`, { 
          auth: {password: password, username: username}
        });
  }

  const renderMessages = () => {
    if (!messages) {
      return(<div></div>)
    }
  
    const keys = Object.keys(messages);
    keys.reverse();

    return keys.map((key, index) => {
      const i = parseInt(key);

      
      const message = {
        text: messages[i].text,
        user: {
          id: messages[i]["user_id"],
          name: messages[i].username
        },
        file: undefined,
      }

      if(messages[i].file !== null) {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        message.file = {
          href: `http://${username}:${password}@127.0.0.1:5000/file/${messages[i].file.id}`,
          isImage: messages[i].file.isImage
        }
      }

      console.log(messages[i].file);

      const lastMessage = i === (keys.length - 1) ? null : {
        text: messages[i + 1].text,
        user: {
          id: messages[i + 1]["user_id"],
          name: messages[i + 1].username
        }
      };
  
      const isMymessage = parseInt(localStorage.getItem("userId")) === message.user.id

      return (
        <div key={`msg_${i}`} style={{ width: '100%' }}>
          <div className="message-block">
            {isMymessage
              ? <MyMessage message={message} />
              : <TheirMessage message={message} lastMessage={lastMessage} />
            }
          </div>
        </div>
      );
    });
  };

  
  if (!localStorage.getItem("chatId")) return <div />;

  return (
    <div className="chat">
      <div className="chat-feed"> 
        
          <div className="chat-title">
              {localStorage.getItem("chatName")} - {localStorage.getItem("chatId")}
          </div>

        <div className="chat-messages">
          {renderMessages()}
        </div>
      </div>
      <div className="message-form-container">
        <MessageForm />
        <AddUserForm />
      </div>
    </div>
  );
};

export default Chat;
