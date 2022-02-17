import { useEffect, useState } from 'react';
import axios from "axios";
import React from 'react';

const ChatList = (props) => {
  const [value, setValue] = useState("");
  const [servers, setServers] = useState(undefined);

  useEffect(() => availableChats().then(response => {
    const servers = response.data.servers.map(server => <div onClick={()=> {localStorage.setItem("chatId", server.id); localStorage.setItem("chatName", server.name); window.location.reload();}}> {server.name} </div>);
    setServers(servers);
  }), [])

  const availableChats = async () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return await axios.get(`http://127.0.0.1:5000/availableServers`, { auth: {password: password, username: username} });
  }

  const handleChange = (event) => {
    setValue(event.target.value);

    //isTyping(props, chatId);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = value.trim();

    if (text.length > 0) {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      
      await axios.post(`http://127.0.0.1:5000/createServer/${text}`, {},{ auth: {password: password, username: username} });
      
    }
    window.location.reload();
    setValue('');
  };

  return (
    <div> 
      <div className="chats">
        {servers}
      </div>
      
      <div className="create-chat-container">
    
      <form className="create-chat-form" onSubmit={handleSubmit}>
    
        <input
          className="chat-name"
          placeholder="Create chat..."
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <button type="submit" className="send-button">
          +
        </button>
      </form>
      </div>
    </div>
  );
};

export default ChatList;