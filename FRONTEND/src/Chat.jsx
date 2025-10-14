// import "./Chat.css";
// import React, { useContext, useState, useEffect } from "react";
// import { MyContext } from "./MyContext";
// import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// function Chat() {
//     const {newChat, prevChats, reply} = useContext(MyContext);
//     const [latestReply, setLatestReply] = useState(null);

//     useEffect(() => {
//         if(reply === null) {
//             setLatestReply(null); //prevchat load
//             return;
//         }

//         if(!prevChats?.length) return;

//         const content = reply.split(" "); //individual words

//         let idx = 0;
//         const interval = setInterval(() => {
//             setLatestReply(content.slice(0, idx+1).join(" "));

//             idx++;
//             if(idx >= content.length) clearInterval(interval);
//         }, 40);

//         return () => clearInterval(interval);

//     }, [prevChats, reply])

//     return (
//         <>
//             {newChat && <h1>Start a New Chat!</h1>}
//             <div className="chats">
//                 {
//                     prevChats?.slice(0, -1).map((chat, idx) => 
//                         <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
//                             {
//                                 chat.role === "user"? 
//                                 <p className="userMessage">{chat.content}</p> : 
//                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
//                             }
//                         </div>
//                     )
//                 }

//                 {
//                     prevChats.length > 0  && (
//                         <>
//                             {
//                                 latestReply === null ? (
//                                     <div className="gptDiv" key={"non-typing"} >
//                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
//                                 </div>
//                                 ) : (
//                                     <div className="gptDiv" key={"typing"} >
//                                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
//                                 </div>
//                                 )

//                             }
//                         </>
//                     )
//                 }

//             </div>
//         </>
//     )
// }

// export default Chat;

import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {
        newChat,
        prevChats,
        reply,
        currThreadId,
        setPrevChats,
        allThreads,
        setCurrThreadId
    } = useContext(MyContext);

    const [latestReply, setLatestReply] = useState(null);

    // Load latest thread automatically after login
    useEffect(() => {
        if (!currThreadId && allThreads?.length) {
            const latestThread = allThreads[0]; // most recent thread
            setCurrThreadId(latestThread.threadId);

            // Fetch its messages
            const fetchThread = async () => {
                const token = localStorage.getItem("token");
                try {
                    const response = await fetch(`http://localhost:8080/api/thread/${latestThread.threadId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await response.json();
                    setPrevChats(data);
                } catch (err) {
                    console.log(err);
                }
            };
            fetchThread();
        }
    }, [allThreads, currThreadId, setCurrThreadId, setPrevChats]);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {prevChats?.slice(0, -1).map((chat, idx) =>
                    <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                        {chat.role === "user" ?
                            <p className="userMessage">{chat.content}</p> :
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )}

                {prevChats.length > 0 && (
                    <>
                        {latestReply === null ? (
                            <div className="gptDiv" key={"non-typing"} >
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {prevChats[prevChats.length-1].content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="gptDiv" key={"typing"} >
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {latestReply}
                                </ReactMarkdown>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Chat;
