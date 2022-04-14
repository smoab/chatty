import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Container, Box, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Stack, ButtonGroup, IconButton } from '@chakra-ui/react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useHistory } from 'react-router-dom'

const HomePage = () => {

    const history = useHistory()
    
    useEffect( () => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if (user) history.push('/chat')
    }, [history])  

    return (
    <Container  w='100%' centerContent position='relative'>
        <Box bg='white' color='black' w='100%' p={4} opacity='0.85' borderWidth='1px' my={8}>
            <Text fontSize='4xl' fontFamily='Monoton' color='purple.500' textAlign='center' mb={4}>chatty</Text>
            <Tabs variant='soft-rounded' colorScheme='purple' >
                <TabList >
                    <Tab width='50%'>Sign-In</Tab>
                    <Tab width='50%'>Sign-Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <Login />
                    </TabPanel>
                    <TabPanel px={0}>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
        <Stack mt="16" justify="space-between" direction={{ base: 'column', md: 'row' }} align="center" position='absolute' bottom='0'>
        <Text fontSize="sm" color="subtle">
            Built by Salem Bamukhier &copy; {new Date().getFullYear()}
        </Text>
        <ButtonGroup variant="ghost">
            <IconButton as="a" href="#" aria-label="LinkedIn" icon={<i className='fa-brands fa-linkedin'></i>}/>
            <IconButton as="a" href="#" aria-label="GitHub" icon={<i className='fa-brands fa-github'></i>} />
        </ButtonGroup>
        </Stack>
    </Container>
    )
}

export default HomePage
