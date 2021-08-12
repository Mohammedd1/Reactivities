import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
//import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { Activity } from '../../../app/models/activity';

//activity:selectedActivity --> reference  activity to selectedActivity name
export default observer(function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    //const {selectedActivity,createActivity,updateActivity,loading}=activityStore;
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;

    //populate initialState and store it inside component state
    //const [activity, setActivity] = useState(initialState);

    //using routes
    const { id } = useParams<{ id: string }>();
    // const [activity, setActivity] = useState({
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        description: '',
        category: '',
        // date: '',
        date: null,
        city: '',
        venue: ''
    });

    //yup validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),//using Yup default message
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),//using Yup default message
        city: Yup.string().required()//using Yup default message
    })
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
        // '!' --> exclamation mark after variable name called  :Non-null assertion operator
        // it means you're telling to TypeScript that you're certain that value is not null or undefined.
    }, [id, loadActivity])
    //if we forget to add our dependencies, then what's going to happen is that each time we set the activity
    //that's going to make our component render and evryu time our component redners,then we call the use
    // effect and then we go and sets of states and then we render our component and then we go and use
    // our effect,But if we add dependencuies, then we only execute the code inside here if of these parameters have changed

    function handleFormSubmit(activity: Activity) {

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
        else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    // //track input fields changes
    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

    //     const { name, value } = event.target;
    //     setActivity({ ...activity, [name]: value });
    // }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        // we used clearing below to clear previous floats(without it buttons will float out of the form)
        <Segment clearing>
            {/* 
            Formik need some required props, it needs at least initialValues and onSubmit
            enableReinitialize:we use this to fill the forms fields with activity data when click on manage event(edit activity)
            initialvalues:in this case is equal the activity that we're going to continue to get from our local state

             */}
            <Header content='Activity Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {/*below are the properties that we are intresetd in getting form formik
                1-values
                2- handlechange: is a function that we get from formic,which is goining to handle the input chnages.
                3-handleSubmit: is also from formik
                */}
                {/*because we are using the Field and this automatically wires up to formik, we no longer need the
                 values or the handle change being passed down to our form here just the handle submit for now.
                 {({ values: activity, handleChange, handleSubmit }) => ( */}
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        {/* <FormField>
                            <Field placeholder='Title' name='title' />
                            <ErrorMessage name='title'
                            render={error => <Label basic color='red' content={error}/>}/>
                        </FormField>
                        <Field placeholder='Description' name='description' />
                        <Field placeholder='Category' name='category' />
                        <Field type='date' placeholder='Date' name='date' />
                        <Field placeholder='City' name='city' />
                        <Field placeholder='Venue' name='venue' />

                        {/*after using useField()*/}
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button
                        disabled={isSubmitting || !dirty ||!isValid}
                            loading={loading}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}

            </Formik>

        </Segment>
    )
})