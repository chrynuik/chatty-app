import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends React.Component {
  render(){

    const messages = this.props.messages
    const message = messages.map((message) =>
      <Message messageContent={message.content} messageUsername={message.username} key={message.key} messageType={message.type}/>

    );
    return(
      <main className="messages">
        {message}
      </main>
    );
  }
}

export default MessageList;

