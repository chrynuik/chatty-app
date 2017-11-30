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
        this.setState({messages: this.state.messages.concat(JSON.parse(msg.data))});

      });
      // const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      // const messages = this.state.messages.concat(newMessage)
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
      username: this.state.currentUser.name,
      content: message
    }

    const messages = this.state.messages.concat(newMessage);

    this.socket.send(JSON.stringify(newMessage));
  }
  userNameChange(username){
    let newUsername = {name: username};

    this.setState({currentUser: newUsername});
    //console.log(currentUser);

    //this.socket.send(JSON.stringify(currentUser));
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
          </nav>
          <MessageList  messages={this.state.messages}/>
          <ChatBar onNewMessage={this.newMessage} onUserNameChange={this.userNameChange} />
        </div>
      );
    } else {
      return <h1>Loading...</h1>

  }

  }
}
export default App;
