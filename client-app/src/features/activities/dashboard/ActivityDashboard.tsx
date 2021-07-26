//our Activity Dashboard is goning to be a react component,so we need to
import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from '../dashboard/ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
//specify an intyerface for properties,this will be standard for any component we create.
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;//id here is not optional,we will make sure it will be selected
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}
//first way to pass property to ActivityDashboard
// export default function ActivityDashboard(props:Props) {
//     return (
//         <Grid>
//             <GridColumn width='10'>
//                 <List>
//                     {/* in the below line we have removed any in activities.map((activity: any),after adding Activity interface */}
//                     {props.activities.map((activity) => (
//                         <List.Item key={activity.id}>
//                             {activity.title}
//                         </List.Item>
//                     ))}
//                 </List>
//             </GridColumn>
//         </Grid>
//     )
// }

//second way to pass properties to ActivityDashboard
//destructure the activities property itself
export default function ActivityDashboard({ activities, selectedActivity,
    selectActivity, cancelSelectActivity, editMode, openForm, closeForm,
    createOrEdit, deleteActivity, submitting }: Props) {
    return (
        <Grid>
            <GridColumn width='10'>
                {/* <List> */}
                {/* in the below line we have removed any in activities.map((activity: any),after adding Activity interface */}
                {/* {activities.map((activity) => (
                        <List.Item key={activity.id}>
                            {activity.title}
                        </List.Item>
                    ))} */}
                {/* </List> */}
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                />
            </GridColumn>
            <GridColumn width='6'>
                {/* <ActivityDetails activity={activities[0]}/> */}
                {/* below will show hard coded activity */}
                {/* {activities[0] &&  <ActivityDetails activity={activities[0]}/>} */}
                {/* View activity  */}
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm} />}
                {
                    editMode &&
                    <ActivityForm closeForm={closeForm} 
                    activity={selectedActivity} 
                    createOrEdit={createOrEdit}
                    submitting={submitting} />
                }

            </GridColumn>
        </Grid>
    )
}