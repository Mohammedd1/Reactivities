import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { history } from '../..';
import { access } from 'fs';

export default class UserStore {
    user: User | null = null;
    fbAccessToken: string | null = null;//270
    fbLoading = false;//270

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
    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }
    //207
    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    }
    //270
    getFacebookLoginStatus = async () => {
        window.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.fbAccessToken = response.authResponse.accessToken;
            }
        })
    }

    //267
    facebookLogin = () => {
        //modified 270
        this.fbLoading = true;
        const apiLogin = (accessToken: string) => {
            agent.Account.fbLogin(accessToken).then(user => {
                store.commonStore.setToken(user.token);
                runInAction(() => {
                    this.user = user;
                    this.fbLoading = false;
                })
                history.push('/activities');
            }).catch(error => {
                console.log(error);
                runInAction(() => this.fbLoading = false);
            })
        }
        if (this.fbAccessToken) {
            apiLogin(this.fbAccessToken);
        }
        else {
            window.FB.login(response => {
                apiLogin(response.authResponse.accessToken);

            }, { scope: 'public_profile,email' })
        }

        // window.FB.login(response => {
        //     agent.Account.fbLogin(response.authResponse.accessToken).then(user => console.log(user));//269
        // }, { scope: 'public_profile,email' })
    }
}