import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatbotIcon from './components/ChatbotIcon'
import ChatForm from './components/ChatForm'
import ChatMessage from './components/ChatMessage';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // Helper Function to update chat history
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}]);
    }

    //Format chat history for API request
    history = history.map(({role, text}) => ({role, parts:[{text}]}));

    const requestOptions = {
      method : "POST",
      headers: {"Content-Type": "application/json" },
      body : JSON.stringify({contents: history})
    }

    try {
      // Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong");

      //Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>{
    //Auto- scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);
  return (
    <>
    <div className='TopHeader'></div>
    <div className='container'>
    <div className='toptitle'>ChatBot <span>AI</span></div>
      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
          <ChatbotIcon />
            <h2 className='logo-text'>Momo</h2>
          </div>
          <button className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>
        {/* Chatbot body */}
        <div ref = {chatBodyRef} className='chat-body'>
          <div className='message bot-message'>
            <ChatbotIcon />
            <p className='message-text'>
              Hi👋 I'm Momo🤖<br /> How can I help you today?
            </p>
          </div>
          {/* {Render the chat history dynamically*/}
          {chatHistory.map((chat, index)=>(
            <ChatMessage key={index} chat={chat} />
          ))}

        </div>
        {/*Chatbot Footer */}
        <div className='chat-footer'>
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
          
        </div>
      </div>
      <p className="copyright">Designed by <span>@Saranugit</span></p>
    </div>
    </>
  )
}

export default App
