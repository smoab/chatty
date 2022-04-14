import React from 'react'
import { Image, Text, Box } from '@chakra-ui/react'
import {useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button} from '@chakra-ui/react'

const ProfileModal = ({user, children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <div>
            <span onClick={onOpen}>
                {children}
            </span>
            <Modal size='sm' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h='250px' bg='#655D8A' color='white'>
                    <ModalHeader fontSize='28px' fontFamily='Work sans' d='flex' justifyContent='center' p={2}>
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d='flex' flexDir='row' alignItems='center' justifyContent='flex-start' p={2}>
                        <Image borderRadius='full' boxSize='150px' mr={2} src={user.profilePic} alt={user.name}/>
                        <Box d='flex' flexDir='column'>
                            <Text fontSize={{base:'16px', md:'20px'}} fontFamily='Work sans' fontWeight='thin'> {user.status}</Text>
                            <Text fontSize={{base:'16px', md:'20px'}}>{user.email}</Text>
                         </Box>
                    </ModalBody>
                </ModalContent>
        </Modal>
        </div>
    )
}

export default ProfileModal
