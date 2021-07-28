import React from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

// interface Props {
//     activity: Activity;
//     cancelSelectActivity:()=>void;
//     openForm: (id: string) => void;
// }

export default function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity: activity,openForm,cancelSelectedActivity } = activityStore;

    if(!activity) return <LoadingComponent/>;//we should return jsx element here,this will not return any thing,because we are
    // not oding anything to load activity at this stage
    return (
        <Card fluid>
            {/* {``} -->allows us to directly add javascript property `-->press on ذ  */}
            <Image src={`/assets/categoryImages/${activity.category}.jpg `} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group width='2'>
                    <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit' />
                    {/* below we don't need to use ()=> because we don't pass any parameter to the function */}
                    <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}