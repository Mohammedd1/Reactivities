
import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import CommonStore from './commonStore';
import UserStore from './userStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';

interface Store {
    activityStore: ActivityStore//class can be use also as types
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore:ModalStore;
    profileStore:ProfileStore;//195

}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore:new ModalStore(),
    profileStore:new ProfileStore()//195
}

//react context for the above,we use it in index.tsx file
export const StoreContext = createContext(store);

//create simple react hook that allow us just to use our store inside our components.
//we use it in App.tsx
export function useStore() {
    return useContext(StoreContext);

}