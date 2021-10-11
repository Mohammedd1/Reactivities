import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
//import { v4 as uuid } from 'uuid';
//import { runInNewContext } from "vm"; 
//import ActivityForm from "../../features/activities/form/ActivityForm";
import { format } from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    //title = 'Hello from Mobx';
    activities: Activity[] = [];
    //javascript Map object
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;//prevent never end loading when click on create activity

    constructor() {
        // makeObservable(this, {
        //     title: observable,
        //     //we need to bind this action to the property title
        //     //way 1
        //     //setTitle:action.bound
        //     //way2
        //     setTitle:action

        // })

        //we don't need to specifiy the properties inside makeObservable method 
        makeAutoObservable(this)
    }

    //computed functions
    //sort activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            //Date.parse(a.date) - Date.parse(b.date));
            a.date!.getTime() - b.date!.getTime());
    }


    //Group activities by date
    get groupedActivities() {
        //array of objects that has a key,value pairs
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                // const date = activity.date;
                //const date = activity.date!.toISOString().split('T')[0];
                const date = format(activity.date!, 'dd MMM yyyy');
                //So what we're checking for here is to see if we have a match for this activity on this date.
                //activities[date] = activities[date] if they match then [...activities[date], activity]
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;

            }, {} as { [key: string]: Activity[] })//initial object to fix typing error,it tells us that each element implicitly has in any type
            //because expression of type string cannot be used to index type activity.
            //the key is the date and the value is an array of activity that are on  same date.
        )
    }

    //Actions
    //Action to update observer 'title'
    //way 1
    // setTitle(){
    //     this.title=this.title+'!';
    // }
    //way 2
    //automatically bind to property
    //     setTitle=()=>{
    //         this.title=this.title+'!';
    //     }

    //after refactoring the app using Mobx
    loadActivities = async () => {
        // this.setloadingInitial(true);
        this.loadingInitial = true;
        try {
            //get activities from API
            const activities = await agent.Activities.list();
            //loop over these activities
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setloadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setloadingInitial(false);

        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })

                this.setloadingInitial(false);
                return activity;
            }
            catch (error) {
                console.log(error);
                this.setloadingInitial(false);
            }
        }
    }
    //private helpwer methods
    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }

        //activity.date = activity.date.split('T')[0];//split at T and get the first peice
        activity.date = new Date(activity.date!);
        //this.activities.push(activity);//mutating our states
        this.activityRegistry.set(activity.id, activity);
    }
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
    setloadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    //we don't need the below methods
    // selectActivity = (id: string) => {
    //     //this.selectedActivity = this.activities.find(a => a.id === id);
    //     this.selectedActivity = this.activityRegistry.get(id);

    // }
    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }
    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }
    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: ActivityFormValues) => {
        // this.loading = true;
        //after using history to redirect after the submit, we will move the uuid from below and set itin ActivityForm.tsx
        //activity.id = uuid();
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);//174
            newActivity.hostUsername = user!.username;//174
            newActivity.attendees = [attendee];//174
            this.setActivity(newActivity);//174
            //update activity array inside our store
            runInAction(() => {
                //this.activities.push(activity);
                //this.activityRegistry.set(activity.id, activity);
                //this.selectedActivity = activity;
                // this.editMode = false;
                // this.loading = false;
                this.selectedActivity = newActivity;//174
            })
        } catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loading = false;
            // })
        }
    }
    updateActivity = async (activity: ActivityFormValues) => {
        // this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                //this.activityRegistry.set(activity.id, activity);
                //this.selectedActivity = activity;
                // this.editMode = false;
                // this.loading = false;

                //174
                if (activity.id) {
                    let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }


            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }

    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                //when click on view the activity will appear on the right hand,then if we click on delete
                //it will delete it form the list but it will still appear on the right hand,below code will disappear it 
                // if (this.selectedActivity?.id == id) this.cancelSelectedActivity();
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }

    }
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }
                else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;

                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    //175
    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }

    }
} 
