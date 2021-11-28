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
    refreshTokenTimeout: any;//277

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
            this.startRefreshTokenTimer(user);//277
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
            store.commonStore.setToken(user.token);//278
            runInAction(() => this.user = user);
            this.startRefreshTokenTimer(user);//277
        } catch (error) {

        }
    }

    register = async (creds: UserFormValues) => {
        try {
            // const user = await agent.Account.register(creds);
            // //set the token
            // store.commonStore.setToken(user.token);
            // this.startRefreshTokenTimer(user);//277
            // // if we want to modify unobservable, then it has to be inside an action.
            // runInAction(() => this.user = user);
            // //push the user into a new location after successfully logged in 
            // history.push('/activities');
            // //close login modal
            // store.modalStore.closeModal();

            //modified 286
            await agent.Account.register(creds);
            history.push(`/account/registerSuccess?email=${creds.email}`);
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
                this.startRefreshTokenTimer(user);//277
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
    //277
    refreshToken = async () => {
        this.stopRefreshTokenTimer();//278
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        }
        catch (error) {
            console.log(error);
        }
    }
    //277
    private startRefreshTokenTimer(user: User) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    //277
    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}