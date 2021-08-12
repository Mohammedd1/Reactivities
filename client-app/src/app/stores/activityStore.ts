import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
//import { v4 as uuid } from 'uuid';
//import { runInNewContext } from "vm";
//import ActivityForm from "../../features/activities/form/ActivityForm";
import {format} from 'date-fns';

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
                const date =format(activity.date!,'dd MMM yyyy');
                //So what we're checking for here is to see if we have a match for this activity on this date.
                //activities[date] = activities[date] if they match then [...activities[date], activity]
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;

            },{} as {[key:string]:Activity[]})//initial object to fix typing error,it tells us that each element implicitly has in any type
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

    createActivity = async (activity: Activity) => {
        this.loading = true;
        //after using history to redirect after the submit, we will move the uuid from below and set itin ActivityForm.tsx
        //activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            //update activity array inside our store
            runInAction(() => {
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
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
}
