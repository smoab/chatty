

export const getRecepient = (loggedInUser, users) => {
        return users[0]._id === loggedInUser._id ? users[1] : users[0]
    } 

export const getRecepientName = (loggedInUser, users) => {
        return users[0]._id === loggedInUser._id ? users[1].name : users[0].name
    } 

export const isSameSender = (allMsgs, currMsg, i, userId) => {
    return (
        i < allMsgs.length -1 &&
        currMsg.sender._id !== userId &&
        (allMsgs[i+1].sender._id !== currMsg.sender._id  ||  allMsgs[i+1].sender._id === undefined )
    )
}

export const isLastMessage = (allMsgs, i, userId) => {
    return (
        i === allMsgs.length -1 &&
        allMsgs[allMsgs.length - 1].sender._id &&
        allMsgs[allMsgs.length - 1].sender._id !== userId
    )
}

export const getSenderMargin = (allMsgs, currMsg, i, userId) => {
    if (
        i < allMsgs.length -1 &&
        currMsg.sender._id !== userId &&
        allMsgs[i+1].sender._id === currMsg.sender._id
    ) return 0

    else if (
            (i < allMsgs.length - 1 && allMsgs[i+1].sender._id !== currMsg.sender._id && currMsg.sender._id !== userId) ||
            ( i === allMsgs.length - 1 && currMsg.sender._id !== userId)
    ) return 0
    else return 'auto'
}

export const isSameSenderAsBefore = (allMsgs, currMsg, i) => {
    return i > 0 && allMsgs[i-1].sender._id === currMsg.sender._id
}