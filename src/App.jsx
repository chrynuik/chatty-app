import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';



class App extends Component {



  constructor(props) {
    super(props);
    this.newMessage = this.newMessage.bind(this)
    this.state = {
      loading: false,
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id: "1",
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id: "2",
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };

  }

  componentDidMount(){
    setTimeout(() =>{
     // console.log("Simulating incomming message");
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      this.setState({
        loading: true,
        messages: messages
      })



    }, 3000)
  }
  newMessage(message){
    const newId = this.state.messages.length + 1;
    const newMessage = {
      id: newId,
      username: this.state.currentUser.name,
      content: message
    }
    const messages = this.state.messages.concat(newMessage)
    //add new message like timeout above
    this.setState({
      messages: messages
    })
  }
  render() {
    if (this.state.loading) {
      return (
        <div>
          <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
          </nav>
          <MessageList messages={this.state.messages}/>
          <ChatBar onNewMessage={this.newMessage} currentUser={this.state.currentUser.name}/>
        </div>
      );
    } else {
      return <h1>Loading...</h1>

  }

  }
}
export default App;
