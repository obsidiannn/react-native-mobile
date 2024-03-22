import socketClient, { Socket } from 'socket.io-client'
import {API_BASE_URL} from "@env";
import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { globalStorage } from './storage';
import quickAes from './quick-aes';
import { useRecoilState } from 'recoil';
import { NowAccount } from '@/stores/app';


export const SocketContext = React.createContext({socket: null})


const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transport: ['websocket','polling'],
    query: {
        platform: Platform.OS
    }
}

export const SocketProvider = ({children}) => {
    const env = API_BASE_URL
    const socketRef = useRef<Socket|null>( null)
    const [wallet,] = useRecoilState(NowAccount)

    const loadSocketConfig = () => {
        const sysPubKey = globalStorage.getString('sys-pub-key');
        
        if(!wallet || !sysPubKey){
            return null
        }
        const content = JSON.stringify({id: wallet.address})
        const time = String(Math.floor(new Date().getTime() / 1000))
        // const sharedSecret = wallet.signingKey.computeSharedSecret(Buffer.from(sysPubKey, 'hex'))
        const dataHash = quickAes.En(content,sysPubKey)
        const sign = wallet.signMessageSync(dataHash + ':' + time)
        const config = {
            ...connectionConfig,
            query: {
                ...connectionConfig,
                'X-Pub-Key': wallet.signingKey.publicKey,
                'X-Sign': sign,
                'X-Time': time,
                'X-Data-Hash': dataHash
            }
        }
        return config
    }

    const initSocket = ()=>{
        const config = loadSocketConfig()
        if(config === null){
            return
        }
        socketRef.current = socketClient(env,config)
        socketRef.current.on('connect',()=>{
            console.log('socket conencted');
            
        })
        socketRef.current.on('message',(msg)=>{
            console.log('[socket message]',msg)
        })
        socketRef.current.on('disconnect',msg=>{
            console.log('socket disconnect');
            socketRef.current = socketClient(env,config)
        })
    }
    useEffect(()=>{
        if(wallet){
            console.log('wallet socket');
            
            initSocket()
        }
        return ()=>{
            if(socketRef && socketRef.current){
                socketRef?.current?.removeAllListeners()
                socketRef.current.close()
            }
        }
    },[])

    return <SocketContext.Provider value={{socket: socketRef.current}} >
        {children}
    </SocketContext.Provider>
}