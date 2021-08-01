import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ChangeEvent, useState } from 'react';
import { useHistory, useParams,Link } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
//import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';

// interface Props {
//     createOrEdit:(activity:Activity) =>void;
//     submitting:boolean;
// }

//activity:selectedActivity --> reference  activity to selectedActivity name
export default observer(function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    //const {selectedActivity,createActivity,updateActivity,loading}=activityStore;
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;

    /*we will be going to make some adjustment on theblow code after adding the routes to handle
     the create activity and edit activity when using routes,not on the same component */
    //we adding the below for filling the inputs with the selected activity or empty when we create a new activity
    // const initialState = activityStore.selectedActivity ?? {
    //     id: '',
    //     title: '',
    //     date: '',
    //     description: '',
    //     category: '',
    //     city: '',
    //     venue: ''
    // }

    //populate initialState and store it inside component state
    //const [activity, setActivity] = useState(initialState);

    //using routes
    const { id } = useParams<{ id: string }>();
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
        // '!' --> exclamation mark after variable name called  :Non-null assertion operator
        // it means you're telling to TypeScript that you're certain that value is not null or undefined.
    }, [id, loadActivity])
    //if we forget to add our dependencies, then what's going to happen is that each time we set the activity
    //that's going to make our component render and evryu time our component redners,then we call the use
    // effect and then we go and sets of states and then we render our component and then we go and use
    // our effect,But if we add dependencuies, then we only execute the code inside here if of these parameters have changed

    function handleSubmit() {
        //createOrEdit(activity);
        //activity.id ? updateActivity(activity) : createActivity(activity);

        //redirectiona fter submisision
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            //then callback to send them to the location we want them to go,in this case will 
            //take us to the new activity 
            //`` --> ta
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        }
        else{
            updateActivity(activity).then(()=> history.push(`/activities/${activity.id}`))
        }
    }

    //track input fields changes
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        // we used clearing below to clear previous floats(without it buttons will float out of the form)
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                {/* <Button loading={submitting} floated='right' positive type='submit' content='Submit' /> */}
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})