//our Activity Dashboard is goning to be a react component,so we need to
import React from 'react'
import { SyntheticEvent } from 'react';
import { useState } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

//specify an intyerface for properties,this will be standard for any component we create.
interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityList({ activities, selectActivity, deleteActivity, submitting }: Props) {

    //handle loading spinner on the click of specific delete button
    const [target, setTarget] = useState('');//will contains the button name
    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment>
            <Item.Group divided>
                {activities.map((activity) => (
                    <Item key={activity.id}>
                        <Item.Content>
                            {/*as='a' --> anchor element*/}
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city},{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                {/* ()=>selectActivity(activity.id) will render the function when we click on the button,this to avoid error */}
                                <Button onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue' />
                                {/*we adding name property to the below button to give each button a uniqure name
                                and this to prevent other delete button from showin the loading spinner only 
                                show it on the clicked button*/}
                                <Button
                                    name={activity.id}
                                    loading={submitting && target===activity.id}
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}