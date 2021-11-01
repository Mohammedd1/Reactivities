//195
import { makeAutoObservable, runInAction } from 'mobx';
import { Photo, Profile } from '../models/profile';
import agent from '../api/agent';
import { store } from './store';


export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;//203
    loading = false;//204

    constructor() {
        makeAutoObservable(this);
    }

    //198
    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }
    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false)
        }

    }

    //203
    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })

        }
        catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }
    //204
    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;//make the current main photo as not main
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;//make the new photo as main photo
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })

        }
        catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);

        }

    }
    //205
    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
                    this.loading=false;
                }
            })

        }
        catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }
}