import { useState } from 'react';

import axios from 'axios';

const AddUserForm = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);

    //isTyping(props, chatId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = value.trim();

    if (text.length > 0) {
      
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      axios.post(`http://127.0.0.1:5000/addToServer`, {"server_id": parseInt(localStorage.getItem("chatId")), username: text},{ auth: {password: password, username: username}, headers: { "Content-Type": "application/json" } });
    }

    window.location.reload();
    setValue('');
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
        
      <input
        className="message-input"
        placeholder="Add user..."
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <button type="submit" className="send-button">
        +
      </button>
    </form>
  );
};

export default AddUserForm;