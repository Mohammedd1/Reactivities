
import {createContext,useContext} from 'react';
import  ActivityStore from './activityStore';
import CommonStore from './commonStore';

interface Store{
    activityStore:ActivityStore//class can be use also as types
    commonStore:CommonStore;

}

export const store:Store={
    activityStore: new ActivityStore(),
    commonStore:new CommonStore()
}

//react context for the above,we use it in index.tsx file
export const StoreContext=createContext(store);

//create simple react hook that allow us just to use our store inside our components.
//we use it in App.tsx
export function useStore(){
    return useContext(StoreContext);

}