import { MMKV } from 'react-native-mmkv'

class Storage {
    private storage: MMKV | undefined;
    constructor(id: string, key: string | undefined) {
        this.storage = new MMKV({ id, encryptionKey: key })
    }
    setItem(key: string, val: boolean | string | number | Uint8Array) {
        this.storage?.set(key, val)
        return true
    }
    getBoolean(key: string) {
        return this.storage?.getBoolean(key) ?? undefined
    }
    getString(key: string) {
        return this.storage?.getString(key) ?? undefined
    }
    getNumber(key: string) {
        return this.storage?.getNumber(key) ?? undefined
    }
    getBuffer(key: string) {
        return this.storage?.getBuffer(key) ?? undefined
    }
    getAllKeys() {
        return this.storage?.getAllKeys() ?? []
    }
    
    removeItem(key: string) {
        this.storage?.delete(key)
        return true;
    }
    clearAll() {
        this.storage?.clearAll()
        return true;
    }
    getSize() {
        return 0;
    }
    contains(key: string) {
        return this.storage?.contains(key) ?? false;
    }
}
export const globalStorage = new Storage('global', 'bobochat');
export const EnFileCacheStorage = new Storage('en-file-cache', 'bobochat');
export const globalChatStorage = new Storage('chat','bobochat')

let userStorages = new Map<string, Storage>();

export const getUserStorage = (id: string, key?: string) => {
    if (userStorages.has(id)) {
        return userStorages.get(id);
    }
    let userStorage = new Storage(id, key);
    userStorages.set(id, userStorage);
    return userStorage;
}