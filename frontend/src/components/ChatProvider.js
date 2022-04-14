import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [allChats, setAllChats] = useState([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const [unreadMsgs, setUnreadMsgs] = useState([])



    const history = useHistory()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (!userInfo) {
            history.push('/')
        }else {
            setUser(userInfo)
        }
    }, [])



    return (
        <ChatContext.Provider value={{user, setUser, allChats, setAllChats, selectedChat, setSelectedChat, fetchAgain, setFetchAgain, unreadMsgs, setUnreadMsgs}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => {
    return useContext(ChatContext)
}

export default ChatProvider
