import React, { useState, useEffect } from 'react'
import {useChatContext} from './ChatProvider'
import { Box, Text, Image, Button, Avatar, Spinner, FormControl, Input, InputGroup, InputRightElement, useToast, InputRightAddon } from '@chakra-ui/react'
import ProfileModal from './ProfileModal'
import ScrollableChat from './ScrollableChat'
import axios from 'axios'
import io from 'socket.io-client'
import {getRecepient, getRecepientName} from '../utils/chatLogic'
import Lottie from 'react-lottie'
import typingIndicator from '../animations/typing-indicator.json'

let socket, selectedChatIsTarget


const ChatBox = () => {
    const [allMsgs, setAllMsgs] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMsg, setNewMsg] = useState('')
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const {user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain, unreadMsgs, setUnreadMsgs} = useChatContext()
    const toast = useToast()
    const ENDPOINT = 'https://my-chatty.herokuapp.com/'

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing started", () => setIsTyping(true));
        socket.on("typing stopped", () => setIsTyping(false));

        return () => {
            socket.disconnect()
        }
        
   }, []);
    
   
   
   useEffect( () => {
       if (socket){
           socket.on('message received', receivedMsg => {
               if (!selectedChatIsTarget || selectedChatIsTarget._id != receivedMsg.chat._id){
                    const chatId = receivedMsg.chat._id
                    if(!unreadMsgs.includes(chatId)){
                        setUnreadMsgs([chatId, ...unreadMsgs])
                    }
                } else {
                    setAllMsgs([...allMsgs, receivedMsg])
                }
                setFetchAgain(!fetchAgain)
            })
       }
    })
    
    useEffect( () => {
        fetchMessages()
        selectedChatIsTarget = selectedChat
    }, [selectedChat])


    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            setLoading(true)
            const config = {headers: {Authorization: `Bearer ${user.token}`}}
            const {data} = await axios.get(`api/message/${selectedChat._id}`, config)
            setAllMsgs(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title: 'Error! Failed to load the messages. Please refresh the page',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
    }
    }

    const sendMsg = async e => {
        if((e.key === 'Enter' && newMsg) || e.target.id === 'sendMsgBtn' ){
            try {
                const config = {headers: {"Content-type": "application/json", Authorization: `Bearer ${user.token}`}}
                const {data} = await axios.post('/api/message', {content: newMsg, chatId: selectedChat._id}, config)
                setAllMsgs([...allMsgs, data])
                socket.emit('typing stopped', selectedChat._id)
                socket.emit('new message', data)
                setNewMsg('')
                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: 'Error! Failed to send the message',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            }
        }
    }

    const handleTyping = e => {
        setNewMsg(e.target.value)

        if (!socketConnected) return
        if (!typing){
            setTyping(true)
            socket.emit('typing started', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        const timer = 7000
        setTimeout( () => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timer && typing){
                socket.emit('typing stopped', selectedChat._id)
                setTyping(false)
            }
        }, timer)
    }

    const typingAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: typingIndicator,
        rendererSettings: {
            prespectiveAspectRatio: 'xMidYMid slice'
        }
    }

    return (
        <Box d={{base: selectedChat ? 'flex' : 'none', md: 'flex'}} flexDir='column' alignItems='center' w={{base: '100%', md: '67%'}}  borderWidth='1px'>
            {selectedChat ? (
                <>
                    <Box fontSize={{base: '14px', md: '16px'}}  d='flex' py={2} px={2} w='100%' bg='white' opacity='0.85' alignItems='center' justifyContent={{base: 'flex-start', md: 'center'}} >
                        <Button onClick={() => {socket.emit('left chat', selectedChat._id); setSelectedChat(null)}} variant='ghost' fontSize='lg' d={{base: 'flex', md: 'none'}} mr={2}>
                            <i className="fas fa-arrow-left"></i>
                        </Button>
                        {!selectedChat.isGroupChat ? (
                            <ProfileModal user={getRecepient(user, selectedChat.users)} >
                                <Box cursor='pointer' bg='#F3F3F3' _hover={{bg: '#655D8A', color: 'white'} }
                                            w='100%' d='flex' alignItems='center' justifyself='center' color='black' p={2}  borderRadius='lg' >
                                    <Avatar mr={2} size='sm' cursor='pointer' src={getRecepient(user, selectedChat.users).profilePic} name={(getRecepientName(user, selectedChat.users))} />
                                    <Box>
                                        <Text fontWeight='semibold'>{(getRecepientName(user, selectedChat.users))}</Text>
                                    </Box>
                                </Box>
                            </ProfileModal>
                        ) : (
                            selectedChat.chatName
                        )}
                    </Box>
                    <Box d='flex' flexDir='column' justifyContent='flex-end' px={2} py={1} w='100%' h='100%' borderRadius='lg' overflowY='hidden'>
                            {loading ? (
                                <Spinner size='lg' w={20} h={20} alignSelf='center' margin='auto' />
                            ) : (
                                <>
                                    <Box d='flex' flexDir='column' overflowY='scroll' className='messages'>
                                        <ScrollableChat messages={allMsgs} />
                                    </Box>
                                    <FormControl mt={2}>
                                        {isTyping && <Box d='flex' flexDir='row' overflowY='scroll' className='messages'><Lottie options={typingAnimationOptions} width={70} style={{marginBottom: 15, marginRight: '0'}} /></Box>}
                                        <InputGroup >
                                            <Input size='lg' variant='filled' bg='white'  _focus={{bg: 'white'}}  _hover={{bg: 'white'}} placeholder='What is in your mind?' onKeyDown={sendMsg} value={newMsg} onChange={handleTyping} />
                                         <Button id='sendMsgBtn' onClick={sendMsg} variant='solid' ml={1} h={12} borderRadius='full'  cursor='pointer' bg='#655D8A' _hover={{bg: '#655D8A', color: 'white'}} color='white' >
                                             <i className='fas fa-paper-plane'></i>
                                        </Button>
                                        </InputGroup>
                                    </FormControl>
                                </>
                            )}
                    </Box>
                </>
            ) : (
                <Box d='flex' alignItems='center' justifyContent='center' h='100%' >
                    {/* <Image boxSize='150px' objectFit='cover' src='../../public/no-chats-selected.png' alt='no chats selected' /> */}
                    <Text fontSize='2xl' fontFamily='Work sans' color='gray.700'>Select a chat from the menu or start a new one</Text>
                </Box>
            )}
        </Box>
    )
}

export default ChatBox
export { socket }
