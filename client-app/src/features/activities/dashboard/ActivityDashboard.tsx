//our Activity Dashboard is goning to be a react component,so we need to
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import ActivityList from '../dashboard/ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

//specify an intyerface for properties,this will be standard for any component we create.
// interface Props {
//     activities: Activity[];
//     //createOrEdit: (activity: Activity) => void;
//     deleteActivity: (id: string) => void;
//     submitting: boolean;
// }
//destructure the activities property itself
export default observer(function ActivityDashboard() {

    //Mobx
    const { activityStore } = useStore();
    //destructure the properties that we need from activityStore
    const { selectedActivity, editMode } = activityStore;

    return (
        <Grid>
            <GridColumn width='10'>
                {/* </List> */}
                <ActivityList
                    // activities={activities}
                    // deleteActivity={deleteActivity}
                    // submitting={submitting}
                />
            </GridColumn>
            <GridColumn width='6'>
                {/* View activity  */}
                {selectedActivity && !editMode &&
                    <ActivityDetails />
                }
                {
                    editMode &&
                    <ActivityForm/>
                        // createOrEdit={createOrEdit}
                        // submitting={submitting} />
                }

            </GridColumn>
        </Grid>
    )
})