//our Activity Dashboard is goning to be a react component,so we need to
import React from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

//specify an intyerface for properties,this will be standard for any component we create.
interface Props{
    activities:Activity[];
    selectActivity:(id:string) =>void;
    deleteActivity: (id: string) => void;
}

export default function ActivityList({activities,selectActivity,deleteActivity} : Props){
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
                                   <Button onClick={()=>selectActivity(activity.id)} floated='right' content='View' color='blue'/>
                                   <Button onClick={()=>deleteActivity(activity.id)} floated='right' content='Delete' color='red'/>
                                   <Label basic content={activity.category}/>
                               </Item.Extra>
                           </Item.Content>
                       </Item>
                    ))}
        </Item.Group>
    </Segment>
)
}