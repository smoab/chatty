import React, {useState} from 'react'
import {Box, Input, Tooltip, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider,
             useDisclosure, useToast, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton } from '@chakra-ui/react'
import { useChatContext } from './ChatProvider'
import { useHistory } from 'react-router-dom'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import Loading from './Loading'
import UsersListItem from './UsersListItem'


const Header = ({isOpen, onOpen, onClose}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loadingResults, setLoadingResults] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const {user, selectedChat, setSelectedChat, allChats, setAllChats, unreadMsgs, setUnreadMsgs} = useChatContext()
    const history = useHistory()
    const toast = useToast()


    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        history.push('/')
    }

    const handleSearchUsers = async () => {
        if(!searchTerm) {
            toast({
                title: 'Enter a name or email to find a user',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        try {
            setLoadingResults(true)
            const config = {headers: {Authorization: `Bearer ${user.token}`}}
            const {data} = await axios.get(`/api/user?searchUser=${searchTerm.trim()}`, config)
            setLoadingResults(false)
            setSearchResults(data)

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load search results, try again please',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    }

    const handleLoadChat = async recepientId => {
        try {
            setLoadingChat(true)
            const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}`}}
            const {data} = await axios.post('/api/chat', {recepientId}, config)
            if (!allChats.find(chat => chat._id === data._id)) {
                setAllChats([data, ...allChats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            setSearchTerm('')
            setSearchResults([])
            onClose()

        } catch (error) {
            toast({
                title: 'Error! Could not access the chat',
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
        }
    }

    return (
        <>
            <Box d='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p='5px 10px' >
                <Tooltip label='Search users to start a chat' hasArrow placement='bottom-end'>
                    <Button onClick={onOpen} variant='ghost' fontSize='lg'>
                        <i className='fas fa-search'></i>
                    </Button>
                </Tooltip>
                <Text fontSize='3xl' fontFamily='Monoton' color='purple.500'>
                    chatty
                </Text>
                <div>
                    <Menu>
                        <MenuButton as={Button} p={1} variant='ghost' fontSize='md' m='1'>
                            <Avatar size='sm' cursor='pointer' src={user.profilePic} name={user.name} mr='1'/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem fontWeight='semibold'>Account</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout} color='red.500' fontWeight='semibold'>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            
            <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>
                        Find People
                        <DrawerCloseButton />
                    </DrawerHeader>
                    <DrawerBody px={1}>
                        <Box d='flex' py={2}>
                            <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} mr={1} placeholder='Search by name or email'/>
                            <Button onClick={handleSearchUsers}>Find</Button>
                        </Box>

                        {loadingResults? (
                            <Loading />
                        ) : (
                                searchResults ? (
                                    searchResults.map(userMatch => (
                                    <UsersListItem key={userMatch._id} user={userMatch} handleClick={() => handleLoadChat(userMatch._id)} />
                                ))) : (
                                    <Text fontSize='lg'>No users found</Text>
                                )
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default Header
