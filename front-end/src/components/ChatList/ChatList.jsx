/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import { blue, brown, cyan, deepOrange, deepPurple, green, indigo, lightGreen, orange, pink, purple, red } from '@mui/material/colors';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { getUserData } from '../../../../back-end/utils/authUtils';
import { getLastMessagesPerChat } from "../../lib/chatService";

import Chat from '../Chat/Chat';

import './ChatList.css';

const ChatList = ({ handleCloseChatNav }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectColor, setSelectColor] = useState(null);
    const [selectIcon, setSelectIcon] = useState(null);
    const [messages, setMessages] = useState([]);

    const userData = getUserData();
    const currentUser = userData?.username;
    const isAdmin = userData?.username === "3ds";
    const isMaster = userData?.username === "Admin";

    // Notificações
    // Mensagens nos ultimos 10 min
    // Limite de mensagens

    const chatConfig = {
        chats: isMaster
            ? ["1adm", "1ds", "1rh", "1mkt", "2adm", "2ds", "2mkt", "3adm", "3mkt", "Estoque", "Geral"]
            : isAdmin
                ? ["1adm", "1ds", "1rh", "1mkt", "2adm", "2ds", "2mkt", "3adm", "3mkt", "Admin", "Geral"]
                : ["Admin", "Estoque", "Geral"],

        icons: {
            Admin: <ManageAccountsIcon key="admin" />,
            Estoque: <WidgetsIcon key="estoque" />,
            Geral: <PeopleAltIcon key="geral" />
        },

        colors: {
            Admin: pink[500],
            Estoque: blue[500],
            Geral: green[500]
        },

        usersColors: isMaster ? [cyan[500], lightGreen[500], orange[500], deepOrange[500], red[500], brown[500], purple[500], deepPurple[500], indigo[500]]
            : [purple[500], deepPurple[500], indigo[500], cyan[500], lightGreen[500], orange[500], deepOrange[500], red[500], brown[500]]
    };

    useEffect(() => {
        getLastMessagesPerChat(setMessages);
    }, []);

    const icons = [<ManageAccountsIcon key="admin" />, <WidgetsIcon key="estoque" />, <PeopleAltIcon key="geral" />]

    const colors = [pink[500], blue[500], green[500]]

    let user = 0

    const getSecondWord = (text) => {
        const parts = text.split("_");
        return parts.length > 1 ? parts[1] : text;
    };

    const getFirstWord = (text) => {
        const parts = text.split("_");
        return parts.length > 1 ? parts[0] : text;
    };

    return (
        <div className="chatList" style={selectedChat && { background: "var(--sixth-color)" }}>
            {!selectedChat ? (
                <div className="search">
                    <div className="close" >
                        <ChevronRightIcon onClick={handleCloseChatNav} sx={{ color: '#fff' }} />
                    </div>
                </div>
            ) : (
                <div className="groupInfo">
                    <div className="left">
                        <ArrowBackIcon onClick={() => setSelectedChat(null)} sx={{ color: 'var(--fourth-color)' }} />
                    </div>
                    <div className={selectedChat === "Geral" || selectedChat === "Estoque" || selectedChat === "Admin" ? "omega-grup" : "group"} >
                        <Avatar sx={{ bgcolor: selectColor }}>
                            {selectIcon}
                        </Avatar>
                        <span>{selectedChat}</span>
                    </div>
                </div>
            )}
            {!selectedChat ? (
                <>
                    {chatConfig.chats.map((chat, index) => {
                        const icon = chatConfig.icons[chat] || <p>{chat.toUpperCase()}</p>;
                        const color = chatConfig.colors[chat] || chatConfig.usersColors[user];

                        if (color === chatConfig.usersColors[user]) {
                            user = user + 1;
                        };

                        const chatMessage = messages.find(msg => getSecondWord(msg.chat) === chat);

                        return (
                            <div
                                className={color === chatConfig.usersColors[user - 1] ? "item-user" : "item"}
                                key={index}
                                onClick={() => {
                                    setSelectedChat(chat);
                                    setSelectColor(color);
                                    setSelectIcon(icon);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
                                <div className="texts">
                                    <span>{chat}</span>
                                    {chatMessage && currentUser === getFirstWord(chatMessage.chat) ? (
                                        <span className="last-message">
                                            {chatMessage.sender}: {chatMessage.message.length > 30
                                                ? chatMessage.message.slice(0, 25) + "..."
                                                : chatMessage.message}
                                        </span>
                                    ) : chatMessage && chat === "Geral" ?
                                        (
                                            <span className="last-message">
                                                {chatMessage.sender}: {chatMessage.message.length > 30
                                                    ? chatMessage.message.slice(0, 25) + "..."
                                                    : chatMessage.message}
                                            </span>
                                        ) : ""}
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="messages">
                    <Chat color={colors} icon={icons} selectedChat={selectedChat} />
                </div>
            )}
        </div>
    )
}

export default ChatList
