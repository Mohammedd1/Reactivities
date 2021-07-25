import React from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Card, Image } from 'semantic-ui-react';

interface Props {
    activity: Activity;
    cancelSelectActivity:()=>void;
    openForm: (id: string) => void;
}

export default function ActivityDetails({activity,cancelSelectActivity,openForm} : Props) {
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
                   <Button onClick={()=>openForm(activity.id)} basic color='blue' content='Edit'/>
                   {/* below we don't need to use ()=> because we don't pass any parameter to the function */}
                   <Button onClick={cancelSelectActivity} basic color='grey' content='Cancel'/>
               </Button.Group>
            </Card.Content>
        </Card>
    )
}