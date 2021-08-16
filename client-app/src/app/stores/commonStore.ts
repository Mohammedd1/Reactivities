import { ServerError } from "../models/serverError";
import { makeAutoObservable, reaction } from 'mobx';

export default class CommonStore {
    error: ServerError | null = null;
    //store token upon login
    // token: string | null = null;
    //Persisting token
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        //Persisting token
        //reaction will only runs when this.token changed
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token)
                }
                else {
                    window.localStorage.removeItem('jwt')
                }
            }

        )
    }
    setServerError = (error: ServerError) => {
        this.error = error;
    }
    setToken = (token: string | null) => {
        // if (token) window.localStorage.setItem('jwt', token);
        // this.token = token;
        //Persisting token
        //we don't need to if(token) .. here because reaction() will handle this
        this.token = token;
    }
    setAppLoaded = () => {
        this.appLoaded = true;
    }
}

