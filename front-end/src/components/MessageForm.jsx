import { useState } from 'react';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
//import { sendMessage, isTyping } from 'react-chat-engine';
import axios from 'axios';

const MessageForm = ({test}) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);

    //isTyping(props, chatId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = value.trim();
    const bodyFormData = new FormData();

    if (text.length > 0) {
      bodyFormData.append("server_id", localStorage.getItem('chatId'));
      bodyFormData.append("text", text);
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      axios.post(`http://127.0.0.1:5000/sendMessage`, bodyFormData,{ auth: {password: password, username: username}, headers: { "Content-Type": "multipart/form-data" } });
    }

    window.location.reload();
    setValue('');
  };

  const handleUpload = (event) => {
    //sendMessage(creds, chatId, { files: event.target.files, text: '' });
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
        
      <input
        className="message-input"
        placeholder="Send a message..."
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <label htmlFor="upload-button">
        <span className="image-button">
          <PictureOutlined className="picture-icon" />
        </span>
      </label>
      <input
        type="file"
        multiple={false}
        id="upload-button"
        style={{ display: 'none' }}
        onChange={handleUpload.bind(this)}
      />
      <button type="submit" className="send-button">
        <SendOutlined className="send-icon" />
      </button>
    </form>
  );
};

export default MessageForm;