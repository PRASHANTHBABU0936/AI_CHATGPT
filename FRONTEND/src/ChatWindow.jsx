import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import { useAuth } from "./contexts/AuthContext.jsx";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    console.log("message ", prompt, " threadId ", currThreadId);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: prompt,
            threadId: currThreadId
        })
    };

    try {
        const API_URL = "https://ai-chatgpt-backend.onrender.com"; // Render backend
        const response = await fetch(`${API_URL}/api/chat`, options);
        const res = await response.json();
        console.log(res);
        setReply(res.reply);
    } catch(err) {
        console.log(err);
    }
    setLoading(false);
}


    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>MYGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                        ) : (
                            <i className="fa-solid fa-user"></i>
                        )}
                    </span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownHeader">
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                    <div className="dropDownDivider"></div>
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-user-circle"></i> Profile</div>
                    <div className="dropDownDivider"></div>
                    <div className="dropDownItem logout" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    MYGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;