import React from 'react'
import { Box, Avatar, Text } from '@chakra-ui/react'

const UsersListItem = ({user, handleClick}) => {
    return (
        <Box onClick={handleClick} cursor='pointer' bg='#E8E8E8' _hover={{bg: '#655D8A', color: 'white'}} 
                    w='100%' d='flex' alignItems='center' color='black' p={2} my={1} borderBottomWidth='1px' borderRadius='lg'>
            <Avatar mr={2} size='sm' cursor='pointer' src={user.profilePic} name={user.name} />
            <Box>
                <Text fontWeight='bold'>{user.name}</Text>
                <Text fontSize='xs'>{user.status}</Text>
            </Box>
        </Box>
    )
}

export default UsersListItem
