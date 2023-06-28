import React, {useState, useContext} from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { Box, Button, IconButton, Typography, useTheme, TextField, Paper, FormControl, InputBase } from "@mui/material";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { tokens } from "../theme";
import SearchIcon from '@mui/icons-material/Search';
import NameContext from "../context/NameContext";


var stompClient = null
function ChatRoom () {
    const [userData, setUserData] = useState({
        username:"",
        receiverName:"",
        connected:false,
        message:""
    })
    const theme = useTheme();
    //theme hook
    const colors = tokens(theme.palette.mode);
    // store info of different chat rooms
    const [tab, setTab] = useState("PUBLIC CHATROOM")
    // store all public chats
    const [publicChatLog, setPublicChats] = useState([])
    // store hashmap of user: list of messages []
    const [privateChatLogs, setPrivateChatLog] = useState(new Map())
    //save name to global context
    const {setName} = useContext(NameContext)
    const [inputName, setInputName] = useState("");


    //get time
    const getTime = () => {
        var currentDate = new Date();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12
        // Add leading zeros to minutes if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;
        // Format the time as "00:00 am/pm"
        var formattedTime = hours + ':' + minutes + ' ' + ampm;
        return formattedTime
    }

    const handleUsername =(event)=>{
        const {value} = event.target
        setInputName(event.target.value)
        //set username 
        setUserData((prevUserData) =>( {...prevUserData, username: value}))
    }

    const registerUser = () =>{
        // instantiate a SockJS client object that can be used to establish a WebSocket-like connection to a server that supports SockJS. Specify the server endpoint
        let sock = new SockJS('http://localhost:8080/ws')
            
        //create stomp client object using sock websocket object.'Over' allows the use of other types of websocckets as not all browsers support the same version of websockets,
        //or websockets in general. 
        stompClient=over(sock)
        //connect stompClient object with server using a websocket connection
        stompClient.connect({}, onConnected, onError)
        //set name to global state
        setName(inputName)
    }

    //on successfull 
    const onConnected=()=>{
        setUserData((prevUserData) =>( {...prevUserData, connected: true}))
        //subscribe client to the following destinations to listen out for messages, execute functions on return
        stompClient.subscribe('/chatroom/public', handlePublicMessageReceived)
        stompClient.subscribe('/user/'+userData.username+'/private', handlePrivateMessageReceived)
        joinUser()
    }

    //when user registers, send public message to server to inform all subscribed users of new user
    const joinUser = ()=>{
        let message = {
            senderName: userData.username,
            status:'JOIN'
        }
        stompClient.send('/app/message', [], JSON.stringify(message))
    }

    //accepts message object returned from server which includes header and body
    const handlePublicMessageReceived = (payload)=>{
        //convert to json to javascript object
        let payloadData = JSON.parse(payload.body)
        //payload is message object which has status attribute. If status is message, then save message to publicChat state
        switch(payloadData.status){
            case "JOIN":
                //if there is no chatlogs for the user, create a new entry in privateChatLog hashmap state
                if(!privateChatLogs.get(payloadData.senderName)){
                    const updatedPrivateChats = new Map(privateChatLogs);
                    updatedPrivateChats.set(payloadData.senderName, []);
                    setPrivateChatLog(updatedPrivateChats);
                }
                break;
            //if message, push new message to the public chat log
            case "MESSAGE":
                publicChatLog.push(payloadData)
                setPublicChats([...publicChatLog])
                break;
            default: break;
        }
    }

    //handle received private messages
    const handlePrivateMessageReceived = (payload)=>{
        //convert to json to javascript object
        let payloadData = JSON.parse(payload.body) 
        //check if client has existing messages in private chat, if so, update privateChatLog state with new message
        if(privateChatLogs.get(payloadData.senderName)){
            const updatedPrivateChats = new Map(privateChatLogs);
            updatedPrivateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChatLog(new Map(updatedPrivateChats)); 
        } else {
            //if no existing message from sender, create new entry in privateChatLog state map 
            let messageList = []
            messageList.push(payloadData)
            const updatedPrivateChats = new Map(privateChatLogs);
            updatedPrivateChats.set(payloadData.senderName, messageList);
            setPrivateChatLog(new Map(updatedPrivateChats)); 
        }
    }

    const onError = (error) =>{
        console.log(error)
    }

    //handle form data when user sends a message in chat box
    const handleMessage = (event) =>{
        const {value} = event.target
        setUserData({...userData, "message":value})
    }

    //send public message function
    const sendPublicMessage=()=>{
        //check if client is connected to websocket broker (server)
        if(stompClient){
            //message payload
            let message = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"

            }
            //send message to server via socket
            stompClient.send('/app/message',{},JSON.stringify(message))
            //once message sent, clear the userData.message
            setUserData({...userData, 'message':""})
        }
    }

    //send private message function
    const sendPrivateMessage=()=>{
        //check if client is connected to websocket broker (server)
        if(stompClient){
            //message paylaod
            let message = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status:"MESSAGE"

            }
            
            //if sender and recipient is not the same, update hashmap
            if(userData.username!==tab){
                const updatedPrivateChats = new Map(privateChatLogs);
                updatedPrivateChats.get(tab).push(message);
                setPrivateChatLog(new Map(updatedPrivateChats)); 
                
                // privateChatLogs.get(tab).push(message)
                // setPrivateChatLog(new Map(privateChatLogs))
            }
            
            stompClient.send('/app/private-message',{},JSON.stringify(message))
            //once message sent, clear the userData.message
            setUserData({...userData, 'message':""})
        }
    }


    return ( 
        <Box display='flex' className="chat-box">
            {userData.connected?
                <div className="chat-container">
                    {/* user list ui */}
                    <div className="member-list" style={{backgroundColor: colors.primary[400]}}>
                        <div>
                            <ul>
                                <Box display='flex' backgroundColor={colors.primary[400]} borderRadius='3px' sx={{mb:1}} className="member-search-box">
                                    <InputBase sx={{ fontSize: '20px', ml:2, flex: 1}} placeholder="Search"/>
                                    <IconButton type='button' sx={{p:2}}>
                                        <SearchIcon/>
                                    </IconButton>
                                </Box>
                                <li onClick={()=>{setTab("PUBLIC CHATROOM")}} className={`member ${tab==="PUBLIC CHATROOM" && "active"}`}>
                                        <div className="selector"></div>
                                        <Typography variant="h4" fontWeight="bold">PUBLIC CHATROOM</Typography>
                                </li>
                                {[...privateChatLogs.keys()].map((name, index)=>{
                                    return (name !== userData.username && 
                                            <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>
                                                <div className="selector"></div>
                                                <div className="member-list-profile-pic"><Typography variant="h3" fontWeight="bold">{name[0]}</Typography></div>
                                                <div className="member-list-name"><Typography variant="h4" fontWeight="bold">{name}</Typography></div>
                                            </li>
                                            
                                )})}
                            </ul>
                        </div>
                    </div>
                    {/* chat content ui */} 
                    {tab==="PUBLIC CHATROOM" &&
                        <div className="chat-content" style={{backgroundColor: colors.primary[400]}}>
                            <div className="chat-header" >
                                <div className="chat-profile">
                                    <div>
                                        <Typography variant="h4" fontWeight="bold" >{tab}</Typography>
                                    </div>
                                </div>
                            </div>
                            <ul className="chat-messages"> 
                            {publicChatLog.map((chat, index)=>(
                                <li className="message" key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self" >{chat.senderName}</div>}
                                </li>
                            ))}
                            </ul>

                        <div className="send-message">
                            <div className="message-container">
                                <input type="text" className="message-box" placeholder="Enter public message" value={userData.message} onChange={handleMessage} style={{backgroundColor: colors.primary[400]}}/>
                                <button type='button' className="send-btn" onClick={sendPublicMessage}><SendOutlinedIcon/></button>
                            </div>
                        </div>
                    </div>}

                    {tab!=="PUBLIC CHATROOM" && 
                    <div className="chat-content" style={{backgroundColor: colors.primary[400]}}>
                        <div className="chat-header">
                            <div className="chat-profile">
                                <div>   
                                    <img className="chat-profile-pic" alt="profile-user" src={`../../assets/user.png`}/>
                                </div>
                                <div>
                                    <Typography variant="h4" fontWeight="bold" >{tab}</Typography>
                                </div>
                            </div>
                        </div>
                        <ul className="chat-messages"> 
                        {[...privateChatLogs.get(tab)].map((chat, index)=>(
                            <li className="message" key={index}>
                                {chat.senderName !== userData.username && <div className="message-display-container"><div className="avatar">{chat.senderName}:</div><div className="message-data" style={{backgroundColor:colors.blueAccent[700]}}>{chat.message}</div><div className="message-date">{getTime()}</div></div>}
                                {chat.senderName === userData.username && <div className="message-display-container-self"><div className="avatar self"></div><div className="message-data" style={{backgroundColor:colors.blueAccent[300]}}>{chat.message}</div><div className="message-date">{getTime()}</div></div>}
                            </li>
                        ))}
                        </ul>

                        <div className="send-message">
                            <div className="message-container">
                                <input type="text" className="message-box" placeholder={`Enter private message for ${tab}`} value={userData.message} onChange={handleMessage} style={{backgroundColor: colors.primary[400], color:colors.primary[100]}}/>
                                <button type='button' className="send-btn" onClick={sendPrivateMessage}><SendOutlinedIcon/></button>
                            </div>
                        </div>
                    </div>}
                </div>
                :
                <div className="register">
                    <input 
                        id='user-name'
                        placeholder="Enter Username"
                        value={userData.username}
                        onChange={handleUsername}
                    />
                    <button type='button' onClick={registerUser}>Connect</button> 
                </div>
            }
        </Box>
    );
}

export default ChatRoom;