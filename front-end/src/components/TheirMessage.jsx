const TheirMessage = ({ message, lastMessage }) => {
    const isFirstMessageByUser = !lastMessage || lastMessage.user.id !== message.user.id;
  
    return (
      <div className="message-row">
        {isFirstMessageByUser && (
          <div className="userName" style={{ float: 'left', marginLeft: '4px'}}>
          {message.user.name}
          </div>
        )}
        <div className="message" style={{ float: 'left', clear: 'left', backgroundColor: '#CABCDC', marginLeft: '4px'}}>
          {message.text}
        </div>

      </div>
    );
  };
  
  export default TheirMessage;