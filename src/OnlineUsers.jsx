import React, {Component} from 'react';

class OnlineUsers extends React.Component {
  render() {

    const onlineUsers = this.props.messages;

    return (
      <div className="onlineUsers">{this.props.onlineUsers} users online</div>
    );
  }
}

export default OnlineUsers;