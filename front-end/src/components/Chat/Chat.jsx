/* eslint-disable react/prop-types */
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { cyan, deepOrange, deepPurple, indigo, lightGreen, orange, purple, red } from '@mui/material/colors';

import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';

import { getUserData } from "../../../../back-end/utils/authUtils.js";
import { listenMessages, listenMessagesBetweenUsers, sendMessage } from "../../lib/chatService";

import './Chat.css';

const MAX_CHARACTERS = 80;

const Chat = ({ color, icon, selectedChat }) => {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [character, setCharacter] = useState(0);

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const handleEmoji = (e) => {
        setNewMessage(prev => prev + e.emoji);
        setOpen(false)
    }

    const userData = getUserData();
    const currentUser = userData?.username;

    useEffect(() => {
        if (selectedChat !== "Geral") {
            if (currentUser === "Admin") {
                selectedChat === "Estoque" ? listenMessagesBetweenUsers(`3ds_${currentUser}`, setMessages) :
                    listenMessagesBetweenUsers(`${selectedChat}_${currentUser}`, setMessages);
            } else if (currentUser === "3ds") {
                listenMessagesBetweenUsers(`${selectedChat}_${currentUser}`, setMessages);
            } else {
                selectedChat === "Estoque" ? listenMessagesBetweenUsers(`${currentUser}_3ds`, setMessages)
                    : listenMessagesBetweenUsers(`${currentUser}_${selectedChat}`, setMessages);
            }
        } else {
            listenMessages(selectedChat, setMessages);
        }
    }, [currentUser, selectedChat]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            const messageToSend = newMessage;
            setNewMessage("");

            if (selectedChat !== "Geral") {
                currentUser === "Admin" ? selectedChat === "Estoque" ? await sendMessage(messageToSend, `3ds_${currentUser}`) :
                    await sendMessage(messageToSend, `${selectedChat}_${currentUser}`) :
                    currentUser === "3ds" ? sendMessage(messageToSend, `${selectedChat}_${currentUser}`) : await sendMessage(messageToSend, `${currentUser}_${selectedChat}`);
            } else {
                await sendMessage(messageToSend, selectedChat);
            }

        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const rainbowColors = [
        red[500],
        purple[500],
        deepPurple[500],
        indigo[500],
        cyan[500],
        lightGreen[500],
        orange[500],
        deepOrange[500]
    ];

    const generateRainbowColor = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return rainbowColors[hash % rainbowColors.length];
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARACTERS) {
            setNewMessage(value);
            setCharacter(value.length);
        }
    };

    return (
        <div className='chat'>
            <div className="center">
                {messages.map((msg) => {
                    const isOwnMessage = msg.sender === currentUser;

                    return (
                        <div className={`message ${isOwnMessage ? "own" : ""}`} key={msg.id}>
                            {isOwnMessage ||
                                <Avatar className={msg.sender !== "Admin" && msg.sender !== "3ds" ? "avatar-person" : "avatar"}
                                    sx={{
                                        bgcolor: msg.sender === "3ds" ? color[1] : msg.sender !== "Admin" ? generateRainbowColor(msg.sender) : color[0],
                                    }}
                                >
                                    {msg.sender === "3ds" ? icon[1] : msg.sender !== "Admin" ? msg.sender.toUpperCase() : icon[0]}
                                </Avatar>
                            }
                            <div className="texts">
                                <p>
                                    {msg.message}
                                </p>
                                {msg.timestamp && msg.timestamp.seconds && (
                                    <span>
                                        {formatDistanceToNow(new Date(msg.timestamp.seconds * 1000), {
                                            addSuffix: true,
                                            locale: ptBR
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="input-container">
                    <div className="emoji">
                        <IconButton onClick={() => setOpen((prev) => !prev)} >
                            <AddReactionIcon />
                        </IconButton>
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                        </div>
                    </div>
                    <input
                        className="input-message"
                        type="text"
                        value={newMessage}
                        onKeyDown={handleKeyDown}
                        placeholder="Mensagem"
                        onChange={handleChange}
                    />
                    <p>{character}/80</p>
                </div>
                <IconButton className="sendButton" onClick={handleSendMessage} >
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat