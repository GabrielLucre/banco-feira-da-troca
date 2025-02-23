/* eslint-disable react/prop-types */
import { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';
import SellIcon from '@mui/icons-material/Sell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Drawer from '@mui/material/Drawer';

import ChatList from '../ChatList/ChatList';
import ProductsPrice from '../ProductsPrice/ProductsPrice';
import Timeline from '../Timeline/Timeline';

import './ShortcutsProdutos.css';

const ShortcutsProdutos = ({ estoque }) => {
    // * Botão de abrir Backdrop (Preços)
    const [openPrice, setOpenPrice] = useState(false)

    const handleOpenPrice = () => {
        setOpenPrice(true)
    }

    const handleClosePrice = () => {
        setOpenPrice(false)
    }

    // * Botão de abrir Backdrop (Horários)
    const [openTimeline, setOpenTimeline] = useState(false)

    const handleOpeTimeline = () => {
        setOpenTimeline(true)
    }

    const handleCloseTimeline = () => {
        setOpenTimeline(false)
    }

    // * Botão de abrir barra lateral (NavBar)
    const [openChatNav, setOpenChatNav] = useState(false);

    const handleOpenChatNav = () => {
        setOpenChatNav(true);
    };

    const handleCloseChatNav = () => {
        setOpenChatNav(false);
    };

    const containerClass = estoque ? 'shortcuts-container with-stock' : 'shortcuts-container';

    return (
        <div className={containerClass}>
            <div className='shortcuts'>
                <Tooltip title="Preços">
                    <IconButton variant="contained" onClick={handleOpenPrice}>
                        <SellIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Horários">
                    <IconButton variant="contained" onClick={handleOpeTimeline}>
                        <AccessTimeIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Chat">
                    <IconButton variant="contained" onClick={handleOpenChatNav}>
                        <ChatIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {openPrice && <ProductsPrice openPrice={openPrice} handleClosePrice={handleClosePrice} />}
            {openTimeline && <Timeline openTimeline={openTimeline} handleCloseTimeline={handleCloseTimeline} />}

            <div className="chat-enter">
                <Drawer
                    variant="persistent"
                    anchor={"right"}
                    open={openChatNav}
                    onClose={handleCloseChatNav}
                    classes={{
                        paper: openChatNav ? 'chat-enter' : 'chat-exit',
                    }}
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 380,
                            padding: '1rem',
                            backgroundColor: 'var(--fourth-color)',
                        },
                    }}
                >
                    <ChatList handleCloseChatNav={handleCloseChatNav} />
                </Drawer>
            </div>
        </div>
    )
}

export default ShortcutsProdutos
