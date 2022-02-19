import { useState } from 'react';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
//import { sendMessage, isTyping } from 'react-chat-engine';
import axios from 'axios';

const MessageForm = ({test}) => {
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  const handleChange = (event) => {
    setValue(event.target.value);

    //isTyping(props, chatId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = value.trim();
    const bodyFormData = new FormData();

    if (text.length > 0 || selectedFile) {
      
      bodyFormData.append("server_id", localStorage.getItem('chatId'));
      bodyFormData.append("text", text);

      if (selectedFile) {
        bodyFormData.append("file", selectedFile);
      }
  
      await axios.post(`http://127.0.0.1:5000/sendMessage`, bodyFormData,{ auth: {password: password, username: username}, headers: { "Content-Type": "multipart/form-data" } });
    }

    window.location.reload();
    setValue('');
  };

  const handleUpload =  (event) => {
    setSelectedFile(event.target.files[0])
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
        name="file"
        multiple={false}
        id="upload-button"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <button type="submit" className="send-button">
        <SendOutlined className="send-icon" />
      </button>
    </form>
  );
};

export default MessageForm;