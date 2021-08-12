//import React, { SyntheticEvent, useState } from 'react';
import { Button, Icon, Item, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity';
//import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import {format} from 'date-fns';
interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {
    //const { activityStore } = useStore();
    // const { deleteActivity, loading } = activityStore;
    // //handle loading spinner on the click of specific delete button
    // const [target, setTarget] = useState('');//will contains the button name
    // function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    //     setTarget(e.currentTarget.name);
    //     deleteActivity(id);
    // }




    return (
        //     <Item key={activity.id}>
        //     <Item.Content>
        //         {/*as='a' --> anchor element*/}
        //         <Item.Header as='a'>{activity.title}</Item.Header>
        //         <Item.Meta>{activity.date}</Item.Meta>
        //         <Item.Description>
        //             <div>{activity.description}</div>
        //             <div>{activity.city},{activity.venue}</div>
        //         </Item.Description>
        //         <Item.Extra>
        //             {/* ()=>selectActivity(activity.id) will render the function when we click on the button,this to avoid error */}
        //             {/* <Button onClick={() => activityStore.selectActivity(activity.id)} floated='right' content='View' color='blue' /> */}
        //             {/*Passing id to activity details id*/}
        //             <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue' />
        //             {/*we adding name property to the below button to give each button a uniqure name
        //             and this to prevent other delete button from showin the loading spinner only 
        //             show it on the clicked button*/}
        //             <Button
        //                 name={activity.id}
        //                 // loading={submitting && target === activity.id}
        //                 loading={loading && target === activity.id}
        //                 onClick={(e) => handleActivityDelete(e, activity.id)}
        //                 floated='right'
        //                 content='Delete'
        //                 color='red' />
        //             <Label basic content={activity.category} />
        //         </Item.Extra>
        //     </Item.Content>
        // </Item>

        //**********************************************/
        //Styliing the list item
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                                </Item.Header>
                                <Item.Description>Hosted by MOZ</Item.Description> 
                        </Item.Content>

                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    {/* if the activity could be null so that why we add ! here and in evrywhere in the code*/}
                    <Icon name='clock' />{format(activity.date!,'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            {/* since we are using the floated in button,the button is on the edge to fix this we add clearning to the segment  */}
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                as={Link}
                to={`/activities/${activity.id}`}
                color='teal'
                floated='right'
                content='View'/>
            </Segment>
        </Segment.Group>
    )
}