import React, {Component} from 'react';

class ChatBar extends React.Component {

    constructor(props) {
      super(props);
      this.onMessageInput = this.onMessageInput.bind(this)
      this.onUserNameFocus = this.onUserNameFocus.bind(this)
    }

  onUserNameFocus(event){
    this.props.onUserNameChange(event.target.value);
  }
  onMessageInput(event){
    if (event.charCode == 13) {
      this.props.onNewMessage(event.target.value);
      event.target.value = "";
    }

  }
  render(){
    return(
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name} onBlur={this.onUserNameFocus}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.onMessageInput}/>
      </footer>
    );
  }
}

export default ChatBar;