import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { history } from '../..';

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }
    get isLoggedIn() {
        return !!this.user //cast the user object into boolean
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            //set the token
            store.commonStore.setToken(user.token);
            // if we want to modify unobservable, then it has to be inside an action.
            runInAction(() => this.user = user);
            //push the user into a new location after successfully logged in 
            history.push('/activities');
            //close login modal
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }

    }
    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    }
    //Persisting token
    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {

        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            //set the token
            store.commonStore.setToken(user.token);
            // if we want to modify unobservable, then it has to be inside an action.
            runInAction(() => this.user = user);
            //push the user into a new location after successfully logged in 
            history.push('/activities');
            //close login modal
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }

    }
    //203
    setImage=(image:string)=>{
        if(this.user) this.user.image=image;
    }
    //207
    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
        }
}