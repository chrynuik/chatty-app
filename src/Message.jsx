import React, {Component} from 'react';

class Message extends React.Component {
  render(){
    return(
    <div className="message">
      <span className="message-username">{this.props.messageUsername}</span>
      <span className="message-content">{this.props.messageContent}</span>
      </div>
    );
  }
}

export default Message;