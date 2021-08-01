// import React, { Fragment, useEffect, useState } from 'react';
import { Fragment } from 'react';
// import axios from 'axios';
import { Container } from 'semantic-ui-react';
//import { Activity } from '../models/activity';//added after adding activity.ts interface
import NavBar from '../layout/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
//uuid package
// import { v4 as uuid } from 'uuid';
// import { Agent } from 'https';
//import agent from '../api/agent';
// import { isForInStatement } from 'typescript';
// import LoadingComponent from '../layout/LoadingComponent'
// import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';

import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
function App() {
  //loading sppineer is appearing on each compoents,we we will remove it form here and paste it inside activty dashboard 1,2 and 3
  //using MobX store,hook in store.ts file
  //1
  //const { activityStore } = useStore();

  //local states
  //const [activities, setActivities] = useState([]);
  //const [activities, setActivities] = useState<Activity[]>([]);//added after adding activity.ts interface
  //View selected activity
  // const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);//(undefined is the initial value)
  // //edit mode
  // const [editMode, setEditMode] = useState(false);//set initially to false
  //state for Loading
  //remove the loading from here
  // const [loading, setLoading] = useState(true);//set initially to true
  //state of submitting
  //const [submitting, setSubmitting] = useState(false);//set initially to false

  //2
  // useEffect(() => {
  //   //calling get activities API
  //   //we changed axios.get('http://localhost:5000/api/activities'). to get type safety
  //   //we comment the below when we start using axios section
  //   // axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
  //   //   setActivities(response.data);
  //   // })
  //   // agent.Activities.list().then(response=>{
  //   //   setActivities(response);
  //   // });

  //   //after adding input type=date to input field in form,it won't display the date that returns from activities becuase it is in different format 
  //   //so we need to reformat the date that returns from database
  //   // agent.Activities.list().then(response => {
  //   //   //create a new array of Activity 
  //   //   let activities: Activity[] = [];
  //   //   response.forEach(activity => {
  //   //     activity.date = activity.date.split('T')[0];//split at T and get the first peice
  //   //     activities.push(activity);
  //   //   })
  //   //   setActivities(activities);
  //   //   setLoading(false);//trun off loading indicator
  //   // });

  //   //after refacotring
  //   activityStore.loadActivities();
  // }, [activityStore])//pass in the activity store as a dependncy to use effect here as well

  //remove the below after using Mobx
  // function handleSelectActivity(id: string) {
  //   setSelectedActivity(activities.find(x => x.id === id));
  // }
  // function handleCancelSelectedActivity() {
  //   setSelectedActivity(undefined);
  // }
  // //edit mode 
  // //id? --> optional parameter
  // function handleFormOpen(id?: string) {
  //   id ? handleSelectActivity(id) : handleCancelSelectedActivity();
  //   setEditMode(true);
  // }
  // function handleFormClose() {
  //   setEditMode(false);
  // }

  //remove create or edit from here after using Mobx
  // function handleCreateOreditActivity(activity: Activity) {
  //   /*//check if we have activity id:yes means update, no means create
  //   activity.id ?
  //     //[...activities.filter(x => x.id !== activity.id), activity] removing the activity from the activities list and add 
  //     //the update activity
  //     setActivities([...activities.filter(x => x.id !== activity.id), activity])
  //     //{...activity,id:uuid()}} --> get all the property inside activity and the id of the new created activity set it with a new uuid
  //     : setActivities([...activities, { ...activity, id: uuid() }]);
  //   setEditMode(false);
  //   //displaying the new activity
  //   setSelectedActivity(activity);*/

  //   //Section 6 - posting datat to the server
  //   setSubmitting(true);
  //   if (activity.id) {
  //     agent.Activities.update(activity).then(() => {
  //       setActivities([...activities.filter(x => x.id !== activity.id), activity])
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   }
  //   else {
  //     activity.id = uuid();
  //     agent.Activities.create(activity).then(() => {
  //       setActivities([...activities, activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   }
  // }

  //remove delete from here after using Mobx
  // function handleDeleteActivity(id: string) {
  //   //delete activity on the server
  //   setSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter(x => x.id !== id)]);
  //     setSubmitting(false);
  //   })
  // }

  //check if we are loading before returning the jsx in the below return.
  //if (loading) return <LoadingComponent content='loading app' />

  //3
  //if (activityStore.loadingInitial) return <LoadingComponent content='loading app' />

  const location = useLocation();

  return (
    <>
      {/* //the below lines looks like html but they are not, they are jsx(JavaScript XML)
    // <div className="App">

    //we will using fragment instead of a div to avoid rendering an empty div,and the reason we need somethign here
    //div or fragment is that it is not allowed to return two different elemnts inside the react component,NavBar
    //is an element and Container is an element, we can only add single element and have as many childs as we want 
    //inside it,we are not allowed to return two seperate elements at the same element so we need to add a div or fragment.
    //also a shorthand for <fragment> is empty tag <> and </>
    // <div> 
    // <Fragment> */}
      {/*removeing the below header and replace it with */}
      {/* <Header as='h2' icon='users' content='Reactivities'/> */}
      {/* <NavBar openForm={handleFormOpen} /> */}

      {/* <NavBar/> */}
      {/* <Container style={{ marginTop: '7em' }}> */}
      {/* </List> */}

      {/*Remove the below two lines after Refactoring the app to use MobX*/}
      {/* <h2>{activityStore.title}</h2>
        <Button content='Add exclamation!' positive onClick={activityStore.setTitle}/> */}


      {/*
        Removing below after adding routers
         <ActivityDashboard

          //we sepecifiying activities property to pass activities list into ActivityDashboard
          // activities={activityStore.activities}
          // // createOrEdit={handleCreateOreditActivity}
          // // deleteActivity={handleDeleteActivity}
          // submitting={submitting}
          /> 
        */}
      {/*React Router will return any component that match the path,so '/' will return homepage component
        '/' activities wil return homepage and activities components, so we need to add exact for homepage route
        */}
      {/* <Route exact path='/' component={HomePage}/> */}
      {/* <Route exact path='/activities' component={ActivityDashboard}/> */}
      {/* <Route path='/activities/:id' component={ActivityDetails}/> */}
      {/* <Route path='/createActivity' component={ActivityForm}/> */}
      {/* <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm}/> */}
      {/* </Container> */}
      {/* </div> */}
      {/* </Fragment> */}

      {/* Moving hoem page outside the nav bar */}
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              {/* <Route path='/createActivity' component={ActivityForm} /> */}
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            </Container>
          </>
        )}
      />
    </>

  );
}

//export default App;
//to be able to observe our observable in App
export default observer(App);
