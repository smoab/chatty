import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {useChatContext} from './ChatProvider'
import {isSameSender, isLastMessage, getSenderMargin, isSameSenderAsBefore} from '../utils/chatLogic'
import { Box, Tooltip, Avatar, Text } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {
    const {user} = useChatContext()
    return (
        <ScrollableFeed>
            {messages && 
                messages.map((msg, i) => (
                    <Box key={msg._id} d='flex' >
                        {/* {(isSameSender(messages, msg, i, user._id) || isLastMessage(messages, i, user._id) && 
                            <Tooltip label={msg.sender.name} placement='bottom-start' hasArrow>
                                <Avatar mt='10px' mr={1} size='sm' cursor='pointer' name={msg.sender.name} src={msg.sender.profilePic} />
                            </Tooltip>
                        )} */}
                            <Text fontSize={{base: '18px'}}  maxW='65%' borderRadius='lg' px='10px' py='7px' bg={msg.sender._id === user._id ? '#B9F5D0' : 'white'} 
                                        ml={msg.sender._id == user._id ? '0' : 'auto'} mt={isSameSenderAsBefore(messages, msg, i, user._id) ? '4px' : '10px'}>
                                {msg.content}
                            </Text>
                    </Box>
                ))
            }
        </ScrollableFeed>
    )
}

export default ScrollableChat
