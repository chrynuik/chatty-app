import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';




class App extends Component {



  constructor(props) {
    super(props);


    // this.state = {messages: []};

    this.newMessage = this.newMessage.bind(this)
    this.userNameChange = this.userNameChange.bind(this)
    this.state = {
      loading: false,
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };

  }

  componentDidMount(){
      this.socket = new WebSocket("ws://localhost:3001");

      this.socket.addEventListener('message', (msg) => {
        //console.log(msg.data);
        let parseData = JSON.parse(msg.data);
        let content = parseData.content
        this.setState({messages: this.state.messages.concat(parseData)});
        console.log(parseData);
        switch(parseData.type) {
          case "incomingMessage":
            // handle incoming message
             console.log("New post!")

            break;
          case "incomingNotification":

            console.log(`${parseData.username} has changed their name to ${this.state.currentUser.name}.`)
            break;
          default:
            // show an error in the console if the message type is unknown
            throw new Error("Unknown event type " + data.type);
        }

      });

      this.setState({
        loading: true,
        //messages: messages
      })

      this.socket.onopen = (event) => {
        console.log("socket is open");
      }

  }

  componentWillUnMount(){
    this.wss.close();
  }

  newMessage(message){
    let newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: message
    }
    const messages = this.state.messages.concat(newMessage);
    this.socket.send(JSON.stringify(newMessage));
  }
  userNameChange(username){
    let newUsername = {name: username};
    let contentString = `${this.state.currentUser.name} has changed their name to ${username}.`;
    console.log("i am a console log", contentString);
    let newNotification = {
      type: "postNotification",
      content: contentString
    }
    this.socket.send(JSON.stringify(newNotification));
    this.setState({
      // type: "postNotification",
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
