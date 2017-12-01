import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import OnlineUsers from './OnlineUsers.jsx';




class App extends Component {



  constructor(props) {
    super(props);


    // this.state = {messages: []};

    this.newMessage = this.newMessage.bind(this)
    this.userNameChange = this.userNameChange.bind(this)
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
        //console.log(msg.data);
        let parseData = JSON.parse(msg.data);
        let content = parseData.content;
         console.log("this is parsed data", parseData);

        if (parseData.type === "incomingMessage" || parseData.type === "incomingNotification") {
          this.setState({
            messages: this.state.messages.concat(parseData),
          });

        } else if (parseData.type === "NumberOnlineUsers"){
           console.log("NumberOnlineUsers type passed");
          this.setState({

            numUser: parseData.numUser
          })
        } else {
          throw new Error("Unknown event type " + parseData.type);
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
      console.log("is this what i'm looking for? ",this.state.numUser);
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
