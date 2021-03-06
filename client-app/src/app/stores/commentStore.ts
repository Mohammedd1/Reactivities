//215
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { ChatComment } from '../models/comment';
import { store } from './store';

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                // .withUrl('http://localhost:5000/chat?activityId=' + activityId, { - modfied 254
                .withUrl(process.env.REACT_aPP_CHAT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

            //LoadComments should be the same name we put in ChatHub.cs file
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    //219
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments
                });
            })
            //ReceiveComment should be the same name we put in ChatHub.cs file
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    //219
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);//modified 219
                });
            })
        }
    }
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }
    //217
    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            //SendComment same method name in ChatHub.cs file
            await this.hubConnection?.invoke('SendComment', values);
        }
        catch (error) {
            console.log(error);
        }
    }

}