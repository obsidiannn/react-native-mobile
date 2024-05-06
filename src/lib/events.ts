import { SocketTypeEnum } from "@/api/types/enums";
import { IEvent } from "@/api/types/message";

type TEventEmitterEmmitArgs =
	| { rid: string }
	| { server: string }
	| { message: string }
	| { method: string }
	| { invalid: boolean }
	| { force: boolean }
	| { hasBiometry: boolean }
	| { visible: boolean; onCancel?: null | Function }
	| { cancel: () => void }
	| { submit: (param: string) => void }

class EventEmitter {
	private events: { [key: string]: any };

	constructor() {
		this.events = {};
	}

	addEventListener(event: string, listener: Function) {
        console.log('[event] add listener',event);
        
		if (typeof this.events[event] !== 'object') {
			this.events[event] = [];
		}
		this.events[event].push(listener);
		return listener;
	}

	addEventSingleListener(event: string, listener: Function) {
        console.log('[event] add single listener',event);
        
		if (typeof this.events[event] !== 'object') {
			this.events[event] = [];
		}
		this.events[event] = [listener]
		return listener;
	}


	removeListener(event: string, listener: Function) {
        console.log('[event] remove listener',event);
		if (typeof this.events[event] === 'object') {
			const idx = this.events[event].indexOf(listener);
			if (idx > -1) {
				this.events[event].splice(idx, 1);
			}
			if (this.events[event].length === 0) {
				delete this.events[event];
			}
		}
	}

    generateKey(type: number,key: string): string{
        if(type === SocketTypeEnum.MESSAGE){
            return 'msg_' + key
        }
        return key
    }

	/**
	 * 
	 */
	emit(event: string, ...args: IEvent[]) {
        console.log('[event] emit',event);
        console.log(typeof this.events[event]);
        
		if (typeof this.events[event] === 'object') {
			this.events[event].forEach((listener: Function) => {
				try {
					listener.apply(this, args);
				} catch (e) {
					console.error('[event error]',e)
				}
			});
		}
	}
}

const events = new EventEmitter();
export default events;
