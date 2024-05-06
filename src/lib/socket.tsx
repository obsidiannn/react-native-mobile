import socketClient, { Socket } from 'socket.io-client'
import { API_BASE_URL } from "@env";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { globalStorage } from './storage';
import quickAes from './quick-aes';
import { useRecoilState } from 'recoil';
import { NowAccount } from '@/stores/app';
import { SocketMessageEvent } from '@/api/types/message';
import EventManager from '@/lib/events'

export const SocketContext = React.createContext({ socket: null })


const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transport: ['websocket', 'polling'],
    query: {
        platform: Platform.OS
    }
}

export const SocketProvider = ({ children }) => {
    // const env = API_BASE_URL
    const env = 'http://192.168.31.90:4000'
    const socketRef = useRef<Socket | null>(null)
    const [wallet,] = useRecoilState(NowAccount)
    const [connected, setConnected] = useState<boolean>(false)
    
    // useEffect(()=>{
    //     if (wallet) {
    //         console.log('wallet init socket');
    //         initSocket()
    //     }
    // },[])
    const loadSocketConfig = () => {
        const sysPubKey = globalStorage.getString('sys-pub-key');

        if (!wallet || !sysPubKey) {
            return null
        }
        const content = JSON.stringify({ id: wallet.address })
        const time = String(Math.floor(new Date().getTime() / 1000))
        // const sharedSecret = wallet.signingKey.computeSharedSecret(Buffer.from(sysPubKey, 'hex'))
        const dataHash = quickAes.En(content, sysPubKey)
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

    const initSocket = () => {
        const config = loadSocketConfig()
        console.log('[socket] init:', env);
        if (config === null) {
            return
        }
        socketRef.current = socketClient(env, config)
        socketRef.current.on('connect', () => {
            console.log('[socket] conencted');
            setConnected(true)
        })
        socketRef.current.on('message', (msg) => {
            const _msg = msg as SocketMessageEvent
            console.log('[socket] receive', _msg)
            const eventKey = EventManager.generateKey(_msg.type,_msg.chatId)
            EventManager.emit(eventKey,_msg)
        })
        socketRef.current.on('disconnect', msg => {
            console.log('[socket] disconnect');
            setConnected(false)
            socketRef?.current?.removeAllListeners()
            socketRef.current?.close()
        })
    }

    useMemo(() => {
        if (wallet && connected === false) {
            console.log('wallet [socket]');
            initSocket()
        }
    }, [wallet,connected])
    // useEffect(()=>{
    //     if(wallet){
    //         console.log('wallet socket');

    //         initSocket()
    //     }
    //     return ()=>{
    //         if(socketRef && socketRef.current){
    //             socketRef?.current?.removeAllListeners()
    //             socketRef.current.close()
    //         }
    //     }
    // },[])

    return <SocketContext.Provider value={{ socket: socketRef.current }} >
        {children}
    </SocketContext.Provider>
}