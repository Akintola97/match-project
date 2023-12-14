import React from 'react'
import { useState, useEffect } from 'react';
import Avatar from './Avatar';
import ChatLogo from './ChatLogo';
import { useAuth } from '../AuthContext';

const Chat = () => {
  const [wsConnection, setWsConnection] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const {user, uId} = useAuth();

  useEffect(()=>{
    const ws =new WebSocket('ws://localhost:5000/user')
    setWsConnection(ws);
    ws.addEventListener('message', handleMessage )
  }, [])


function showOnlinePeople(peopleArray){
  const people = {};
  peopleArray.forEach(({userId, username})=>{
    people[userId] = username;
  })
  setOnlinePeople(people);
}


  function handleMessage(e){
    const messageData = JSON.parse(e.data)
    if('online' in messageData){
      showOnlinePeople(messageData.online)
    }
  }


  if (!wsConnection) {
    return null; 
  }


  return (
    <div className='flex min-h-screen'>
      <div className='bg-blue-100 w-1/3 pt-16'>
       <ChatLogo />
        {Object.keys(onlinePeople).map((userId) => (
          uId !== userId && (
            <div
              key={userId}
              onClick={() => setSelectedUserId(userId)}
              className={
                'py-2 pl-4 flex items-center gap-2 cursor-pointer ' +
                (userId === selectedUserId ? 'bg-blue-50' : '')
              }
            >
              {userId ===  selectedUserId && (<div
              className='w-1 bg-blue-500 h-12 rounded-r-md'
              >
              
              </div>)}
              <div className='flex gap-2 py-2 pl-4 items-center'>
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className='capitalize text-gray-800'>
                {onlinePeople[userId]}
              </span>
              </div>
            </div>
          )
        ))}
      </div>
      <div className='flex flex-col bg-blue-300 w-2/3 p-2 pt-20'>
        <div className='flex-grow py-2'> 
          {!selectedUserId &&(
            <div className='flex h-full flex-grow items-center justify-center text-gray-200'>select a user from the sidebar</div>
          )}
        </div>
        {selectedUserId && (
            <div className='flex gap-2'>
            <form className=' flex gap-2'>
            <input type='text' placeholder='Type message here' className='bg-white flex-grow border p-2' value={newMessage} onChange={e=>setNewMessage(e.target.value)} />
            <button type='submit' className='bg-blue-500 p-2 text-white'>Send
            </button>
            </form>
          </div>
        )}
      
      </div>
    </div>
  )
}

export default Chat
