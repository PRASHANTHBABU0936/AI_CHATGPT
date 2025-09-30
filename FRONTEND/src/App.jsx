
// import './App.css';
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import {MyContext} from "./MyContext.jsx";   
// import {useState} from 'react';

// import {v1 as uuidv1} from "uuid";
// import AuthForm from "./AuthForm.jsx"; 
// function App() {
//   const [prompt,setPrompt] = useState("");
//   const [reply,setReply] = useState(null);
//   const [currThreadId,setCurrThreadId]=useState(uuidv1());
// const [prevChats,setPrevChats]=useState([]);
// const [newChat,setNewChat] = useState(true);
// const [allThreads,setAllThreads] = useState([]);
//   const [token, setToken] = useState(localStorage.getItem("token")); 
// const providerValues = {
//   prompt,setPrompt,
//   reply,setReply,
//   currThreadId,setCurrThreadId,
//   newChat,setNewChat,
//   prevChats,setPrevChats,
//   allThreads,setAllThreads,
//   token
// };
//   if (!token) {
//     return <AuthForm setToken={setToken} />;
//   }
//   return (<>
//      <div className='app'>
//       <MyContext.Provider value={providerValues}>
//             <Sidebar></Sidebar>
//       <ChatWindow></ChatWindow>
//       </MyContext.Provider>

//      </div>

//     </>
//   )
// }

// export default App








import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";   
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
{/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className='app'>
          <MyContext.Provider value={providerValues}>
            <Sidebar />
            <ChatWindow />
          </MyContext.Provider>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
