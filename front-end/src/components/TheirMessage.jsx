/* eslint-disable jsx-a11y/alt-text */
const TheirMessage = ({ message, lastMessage }) => {
    const isFirstMessageByUser = !lastMessage || lastMessage.user.id !== message.user.id;
    if(message.file){
      if(message.file.isImage) {
        return (
          <div className="message-row">
            {isFirstMessageByUser && (
              <div className="userName" style={{ float: 'left', marginLeft: '4px'}}>
              {message.user.name}<br />
              <img src={message.file.href} width="200" height="200" href={message.file.href} />
              </div>
            )}
            <div className="message" style={{ float: 'left', clear: 'left', backgroundColor: '#CABCDC', marginLeft: '4px'}}>
              {message.text}<br />
              <a href={message.file}> FILE </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="message-row">
            {isFirstMessageByUser && (
              <div className="userName" style={{ float: 'left', marginLeft: '4px'}}>
              {message.user.name}<br />
              </div>
            )}
            <div className="message" style={{ float: 'left', clear: 'left', backgroundColor: '#CABCDC', marginLeft: '4px'}}>
              {message.text}<br />
              <a href={message.file}> FILE </a>
            </div>
          </div>
        );
      }
      
    } else {
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
    }
    
  };
  
  export default TheirMessage;