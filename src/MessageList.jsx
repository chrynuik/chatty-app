import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends React.Component {
  render(){

    const messages = this.props.messages
    const message = messages.map((message) =>
      <Message messageContent={message.content} messageUsername={message.username} key={message.key}/>

    );
    return(
      <main className="messages">
        {message}
         <div className="message system">
          Anonymous1 changed their name to nomnom.
        </div>
      </main>
    );
  }
}

export default MessageList;

