
import { Profile } from "./profile";

export interface Activity {//no convenbtion to prefixing the interface name with I like we used to did in C#
    id: string;
    title: string;
    date: Date | null;
    //date: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[]
}

//174
export class Activity implements Activity{
    constructor(init?: ActivityFormValues){
        Object.assign(this,init);
    }
}
//class for activity form values(this will give us an opportunity to use a constructo to initialize certain values.)
export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    //the constructor will take activity as a parameter, but it's going to be optional because we
    //want to use this activity, form values for ever creating an activity or editing an existing activity.
    constructor(activity?: ActivityFormValues) {
        if(activity){
            this.id=activity.id;
            this.title=activity.title;
            this.category=activity.category;
            this.description=activity.description;
            this.date=activity.date;
            this.venue=activity.venue;
            this.city=activity.city;

        }

    }
}