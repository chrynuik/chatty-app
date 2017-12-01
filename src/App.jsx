import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import OnlineUsers from './OnlineUsers.jsx';




class App extends Component {

  constructor(props) {
    super(props);

    this.newMessage = this.newMessage.bind(this);
    this.userNameChange = this.userNameChange.bind(this);
    this.state = {
      loading: false,
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      numUser: 1
    };

  }

  componentDidMount(){
      this.socket = new WebSocket("ws://localhost:3001");

      this.socket.addEventListener('message', (msg) => {

        let parseData = JSON.parse(msg.data);
        let content = parseData.content;

        //pass data when user sends a message
        if (parseData.type === "incomingMessage" || parseData.type === "incomingNotification") {
          this.setState({
            messages: this.state.messages.concat(parseData),
          });
          //pass data when user comes or goes offline
        } else if (parseData.type === "NumberOnlineUsers"){
          this.setState({
            numUser: parseData.numUser
          });
        } else {
          throw new Error("Unknown event type " + parseData.type);
        }

      });

      this.setState({
        loading: true,
      });

      this.socket.onopen = (event) => {
        console.log("socket is open");
      };

  }

  componentWillUnMount(){
    this.wss.close();
  }

  //function for adding a new message
  newMessage(message) {
    let newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: message
    };
    const messages = this.state.messages.concat(newMessage);
    this.socket.send(JSON.stringify(newMessage));
  }
  //function for chaning username
  userNameChange(username) {
    let newUsername = {name: username};
    let contentString = `${this.state.currentUser.name} has changed their name to ${username}.`;
    let newNotification = {
      type: "postNotification",
      content: contentString
    };
    this.socket.send(JSON.stringify(newNotification));
    this.setState({
      currentUser: newUsername,
      content : contentString
    });
  }

  render() {

    if (this.state.loading) {
      return (
        <div>
          <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
            <OnlineUsers onlineUsers={this.state.numUser}/>
          </nav>
          <MessageList  messages={this.state.messages}/>
          <ChatBar currentUser={this.state.currentUser} onNewMessage={this.newMessage} onUserNameChange={this.userNameChange} />
        </div>
      );
    } else {
      return <h1>Loading...</h1>
    }
  }
}
export default App;
