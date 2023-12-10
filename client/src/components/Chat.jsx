import React from 'react'
import { useEffect, useState } from 'react'

const Chat = () => {
    
    const [wsconnect, setWsConnect] = useState(null);

    function handleMessage(e){
        console.log('new message', e)
    }



    useEffect(()=>{
      const ws = new WebSocket('ws://localhost:5000');
      setWsConnect(ws);
      ws.addEventListener('message', handleMessage )
    }, []);





  return (
    <div className='flex min-h-screen'>
        <div className='bg-white w-1/3 pt-20'>
            Contacts
        </div>
        <div className='bg-blue-300 w-2/3 pt-20 flex flex-col'>
            <div className='flex-grow'>Messages with selected person</div>
            <div className='flex gap-2'>
                <input type = 'text' className='bg-white flex-grow border p-2 rounded-sm' placeholder='Type your message here' />
                <button className='bg-green-500  hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded transition duration-300 ease-in-out text-[2.4vmin] '>Send</button>
            </div>
        </div>
    </div>
  )
}

export default Chat