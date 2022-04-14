import React, {useState} from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { useChatContext } from './ChatProvider'


const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [confirmedPwd, setConfirmedPwd] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [pwdShown, setPwdShown] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()
    const {setUser} = useChatContext()


    const uploadPic = (pic) => {
        setLoading(true)
        if (pic === undefined){
            toast({
                title: 'Please upload a profile picture',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return;
        }

        if(pic.type === 'image/jpeg' || pic.type === 'image/png'){
            const data = new FormData()
            data.append('file', pic)
            data.append('upload_preset', 'chat-app')
            data.append('cloudname', 'dlguener')
            fetch('https://api.cloudinary.com/v1_1/dlguener/image/upload', {
                method: 'post', body: data
            })
            .then( res => res.json())
            .then(data => {
                setProfilePic(data.url.toString())
                setLoading(false)
            })
            .catch( err => {
                console.log(err)
                setLoading(false)
            })
        } else {
                toast({
                title: 'Please upload a profile picture',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return;
        }
    }

    const submitForm = async () => {
        if (!name || !email || !pwd || !confirmedPwd){
            toast({
                title: 'Please fill all the required fields',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }
        if (pwd !== confirmedPwd){
                toast({
                title: 'The passwords do not match',
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
            let userData
            if(profilePic){
                const {data} = await axios.post('api/user', {name, email, password: pwd, profilePic}, config)
                userData = data
            } else {
                const {data} = await axios.post('api/user', {name, email, password: pwd}, config)
                userData = data
            }
            toast({
                    title: 'Your account is registered successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
            })
            setLoading(false)
            localStorage.setItem('userInfo', JSON.stringify(userData))
            setUser(userData)
            history.push('/chat')

        } catch (error) {
            toast({
                title: 'Error occured while creating your account, please try again',
                discription: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
        }
    }

    return (
        <div>
            <VStack >
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input 
                    placeholder='Enter your preferred name'
                    onChange={ e => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>E-Mail</FormLabel>
                    <Input 
                    placeholder='Enter your personal email'
                    onChange={ e => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input 
                        type={pwdShown? 'text' : 'password'}
                        placeholder='Enter your password'
                        onChange={ e => setPwd(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setPwdShown(!pwdShown)}>
                                {pwdShown? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input 
                        type={pwdShown? 'text' : 'password'}
                        placeholder='Re-Enter your password'
                        onChange={ e => setConfirmedPwd(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setPwdShown(!pwdShown)}>
                                {pwdShown? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl>
                        <FormLabel>Profile Picture</FormLabel>
                        <Input 
                        type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={ e => uploadPic(e.target.files[0])}
                        />
                </FormControl>
                <Button 
                    colorScheme='green'
                    width='100%'
                    style={{marginTop: 30}}
                    onClick={submitForm}
                    isLoading={loading}
                >
                    Sign Up
                </Button>
            </VStack>
        </div>
    )
}

export default Signup
