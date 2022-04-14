import React, {useState, useEffect} from 'react'
import { useChatContext } from '../components/ChatProvider';
import Header from '../components/Header'
import ChatMenu from '../components/ChatMenu'
import ChatBox from '../components/ChatBox'
import {Box, useDisclosure} from '@chakra-ui/react'

const ChatPage = () => {
    const {user} = useChatContext()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div style={{width: '100%'}}>
            {user && <Header isOpen={isOpen} onOpen={onOpen} onClose={onClose} />}
            <Box d='flex' justifyContent='space-between' w='100%' h='93.5vh'>
                {user && <ChatMenu onOpen={onOpen}/>}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage
