//our Activity Dashboard is goning to be a react component,so we need to
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header } from 'semantic-ui-react'
// import { Activity } from '../../../app/models/activity'
import { useStore } from '../../../app/stores/store';
import ActivityListItem from '../dashboard/ActivityListItem'
//specify an interface for properties,this will be standard for any component we create.
// interface Props {
//     activities: Activity[];
//     // selectActivity: (id: string) => void;
//     //deleteActivity: (id: string) => void;
//     submitting: boolean;
// }

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    //const {activitiesByDate}=activityStore;
    const { groupedActivities } = activityStore;
    //handle loading spinner on the click of specific delete button
    // const [target, setTarget] = useState('');//will contains the button name
    // function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    //     setTarget(e.currentTarget.name);
    //     deleteActivity(id);
    // }


    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {
                        activities.map(activity => (
                            <ActivityListItem key={activity.id} activity={activity} />
                        ))}
                </Fragment>
            ))}
        </>

    )
})