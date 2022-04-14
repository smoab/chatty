import React, {useState} from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast, Divider} from '@chakra-ui/react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { useChatContext } from './ChatProvider'


const Login = () => {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdShown, setPwdShown] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()
    const {setUser} = useChatContext()


    const submitForm = async (e) => {
        
        if ((e.key === 'Enter') || (e.target.id === 'loginBtn' )) {
            setLoading(true)
            if (!email || !pwd){
                toast({
                    title: 'Please provide your email and password',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                })
                setLoading(false)
                return
            }
    
            try {
                const config = {headers:{"Content-type": "application/json"}}
                const {data} = await axios.post('api/user/login', {email, password: pwd}, config)
                toast({
                    title: 'Logged in successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                })
                setLoading(false)
                localStorage.setItem('userInfo', JSON.stringify(data))
                setUser(data)
                history.push('/chat')
    
            } catch (error) {
                toast({
                    title: 'Invalid Credentials! Please try again',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                })
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <VStack>         
                <FormControl id='email' isRequired>
                    <FormLabel>E-Mail</FormLabel>
                    <Input 
                    placeholder='Enter your personal email'
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl id='pwd' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input 
                        type={pwdShown? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={pwd}
                        onChange={ e => setPwd(e.target.value)}
                        onKeyDown={submitForm}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setPwdShown(!pwdShown)}>
                                {pwdShown? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button 
                    id='loginBtn'
                    colorScheme='green'
                    width='100%'
                    style={{marginTop: 30}}
                    onClick={submitForm}
                    isLoading={loading}
                >
                    Sign In
                </Button>
                <Divider pt='2' />
                <Button 
                    width='100%'
                    style={{marginTop: 15}}
                    isLoading={loading}
                    onClick={() => {
                        setEmail('anon@example.com')
                        setPwd('12345678')                        
                    }}
                >
                   Get Tester Credentials
                </Button>
            </VStack>
        </div>
    )
}

export default Login
