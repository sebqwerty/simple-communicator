/* eslint-disable jsx-a11y/alt-text */
const MyMessage = ({ message }) => {
    if(message.file){
      if(message.file.isImage) {
        return (
          <div className="message" style={{ float: 'right', marginRight: '18px', color: 'white', backgroundColor: '#3B2A50' }}>
            {message.text} <br />
            <img src={message.file.href} width="200" height="200" href={message.file.href} />
          </div>
        );
      } else {
        return (
          <div className="message" style={{ float: 'right', marginRight: '18px', color: 'white', backgroundColor: '#3B2A50' }}>
            {message.text} <br />
            <a href={message.file.href}> FILE </a>
          </div>
        )
      }
      
    } else {
      return (
        <div className="message" style={{ float: 'right', marginRight: '18px', color: 'white', backgroundColor: '#3B2A50' }}>
          {message.text} 
        </div>
      );
    }
    
  };
  
  export default MyMessage;