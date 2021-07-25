import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit:(activity:Activity) =>void;
}

//activity:selectedActivity --> reference  activity to selectedActivity name
export default function ActivityForm({ activity: selectedActivity, closeForm,createOrEdit }: Props) {
    //we adding the below for filling the inputs with the selected activity or empty when we create a new activity
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    }
    //populate initialState and store it inside component state
    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        createOrEdit(activity);
    }

    //track input fields changes
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

        const { name, value } = event.target;
        setActivity({...activity,[name]:value});
    }

    return (
        // we used clearing below to clear previous floats(without it buttons will float out of the form)
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}