// import "./Sidebar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v1 as uuidv1 } from "uuid";
// // import logo from "./assets/blacklogo.png";

// function Sidebar() {
//     const {
//         allThreads,
//         setAllThreads,
//         currThreadId,
//         setNewChat,
//         setPrompt,
//         setReply,
//         setCurrThreadId,
//         setPrevChats
//     } = useContext(MyContext);

//     const token = localStorage.getItem("token"); // Get JWT token

//     const getAllThreads = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/api/thread", {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });
//             const res = await response.json();
//             const filteredData = res.map(thread => ({
//                 threadId: thread.threadId,
//                 title: thread.title
//             }));
//             setAllThreads(filteredData);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId]);

//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     };

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);

//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });
//             const res = await response.json();
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const deleteThread = async (threadId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });
//             const res = await response.json();
//             console.log(res);

//             // updated threads re-render
//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//             if (threadId === currThreadId) {
//                 createNewChat();
//             }

//         } catch (err) {
//             console.log(err);
//         }
//     };

//     return (
//         <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
//                 <h3
//                     style={{
//                         position: "relative",
//                         left: "-20px",
//                         fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
//                         fontWeight: 500,
//                         fontSize: "18px"
//                     }}
//                 >
//                     New Chat
//                 </h3>
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>

//             <ul className="history">
//                 {allThreads?.map((thread, idx) => (
//                     <li key={idx}
//                         onClick={() => changeThread(thread.threadId)}
//                         className={thread.threadId === currThreadId ? "highlighted" : ""}
//                     >
//                         {thread.title}
//                         <i className="fa-solid fa-trash"
//                             onClick={(e) => {
//                                 e.stopPropagation(); // stop event bubbling
//                                 deleteThread(thread.threadId);
//                             }}
//                         ></i>
//                     </li>
//                 ))}
//             </ul>

//             <div className="sign">
//                 <p>MYGPT🌐</p>
//             </div>
//         </section>
//     );
// }

// export default Sidebar;


import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const token = localStorage.getItem("token"); // Get JWT token

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const res = await response.json();
            // Sort by updatedAt descending (latest first)
            const filteredData = res
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title || "New Chat"
                }));
            setAllThreads(filteredData);

            // Load latest thread automatically if none selected
            if (!currThreadId && filteredData.length > 0) {
                const latestThread = filteredData[0];
                setCurrThreadId(latestThread.threadId);
                setPrevChats(await fetchThreadMessages(latestThread.threadId));
                setNewChat(false);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const fetchThreadMessages = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const res = await response.json();
            return res;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    useEffect(() => {
        getAllThreads();
    }, []);

    const createNewChat = () => {
        const newId = uuidv1();
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(newId);
        setPrevChats([]);

        // Prepend new chat to threads
        setAllThreads(prev => [{ threadId: newId, title: "New Chat" }, ...prev]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        const messages = await fetchThreadMessages(newThreadId);
        setPrevChats(messages);
        setNewChat(false);
        setReply(null);
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const res = await response.json();
            console.log(res);

            // Update threads
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                <h3
                    style={{
                        position: "relative",
                        left: "-20px",
                        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px"
                    }}
                >
                    New Chat
                </h3>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        {thread.title}
                        <i className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>MYGPT🌐</p>
            </div>
        </section>
    );
}

export default Sidebar;
