import React, {useState, useEffect} from 'react'
import {useChatContext} from '../components/ChatProvider'
import { useToast, Box, Text, Button, Stack, Avatar, AvatarBadge } from '@chakra-ui/react'
import axios from 'axios'
import Loading from './Loading'
import {getRecepientName, getRecepient} from '../utils/chatLogic'
import { socket } from './ChatBox'


const ChatMenu = ({onOpen}) => {
    const [loggedInUser, setLoggedInUser] = useState()
    const {user, selectedChat, setSelectedChat, allChats, setAllChats, fetchAgain, unreadMsgs, setUnreadMsgs} = useChatContext()
    const toast = useToast()

    const fetchUserChats = async () => {
        try {
            const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}`}}
            const {data} = await axios.get('/api/chat', config)
            setAllChats(data)
        } catch (error) {
            toast({
                title: 'Error! Failed to load your chats',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    }

    const handleSelectChat = chat => {
        if (selectedChat){
            socket.emit('left chat', selectedChat._id)
        }
        setSelectedChat(chat)
        setUnreadMsgs(unreadMsgs.filter(msg => msg !== chat._id))
    }


    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchUserChats()
    }, [fetchAgain])

    return (
        <Box d={{base: selectedChat ? 'none' : 'flex', md: 'flex'}} flexDir='column' alignItems='center'
                    p={2} bg='white' opacity='0.85' w={{base: '100%', md: '33%'}}  borderWidth='1px' borderRight={0}>
            <Box py={2}  fontSize={{base: '24px', md: '30px'}} fontFamily='Work sans' d='flex' w='100%' justifyContent='space-between' alignItems='center' >
                <Text fontWeight='semibold'>Chats</Text>
                <Button onClick={onOpen} d='flex' fontSize={{base: '16px', md: '14px', lg: '16px'}} bg='#F3F3F3' _hover={{bg: '#655D8A', color: 'white'}}>
                    <i className='fa-solid fa-plus'></i>
                    <Text ml={2}>New Chat</Text>
                </Button>
            </Box>
            <Box d='flex' flexDir='column' w='100%' h='100%' borderRadius='lg' overflowY='hidden'>
                {allChats ? (
                    <Stack overflowY='scroll'>
                        {allChats.map( chat => (
                            <Box key={chat._id} onClick={() => handleSelectChat(chat)} cursor='pointer'  _hover={{bg: '#655D8A', color: 'white'}} bg={selectedChat === chat ? '#655D8A' : '#F3F3F3'}
                                        color={selectedChat === chat ? 'white' : 'black'} p={2} borderRadius='lg' d='flex' alignItems='center'>
                                     <Avatar mr={3} size='md' cursor='pointer' bg='#655D8A' src={!chat.isGroupChat? getRecepient(loggedInUser, chat.users).profilePic : ''} name={!chat.isGroupChat? getRecepientName(loggedInUser, chat.users) : chat.chatName}>
                                     { unreadMsgs.includes(chat._id) && <AvatarBadge boxSize='1em' bg='#46d160' /> }

                                     </Avatar>

                                    <Box>
                                        <Text fontWeight='bold'>
                                            {!chat.isGroupChat
                                            ? getRecepientName(loggedInUser, chat.users)
                                            : chat.chatName
                                            }
                                        </Text>
                                        {chat.latestMessage && <Text fontSize='sm' noOfLines={1}>{chat.latestMessage.content}</Text>}

                                    </Box>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Loading />
                )}
            </Box>
        </Box>
    )
}

export default ChatMenu
