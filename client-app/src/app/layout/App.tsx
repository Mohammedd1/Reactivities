import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';//added after adding activity.ts interface
import NavBar from '../layout/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
//uuid package
import { v4 as uuid } from 'uuid';

function App() {

  //const [activities, setActivities] = useState([]);
  const [activities, setActivities] = useState<Activity[]>([]);//added after adding activity.ts interface
  //View selected activity
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);//(undefined is the initial value)
  //edit mode
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    //calling get activities API
    //we changed axios.get('http://localhost:5000/api/activities'). to get type safety
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }
  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }
  //edit mode 
  //id? --> optional parameter
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }
  function handleFormClose() {
    setEditMode(false);
  }
  function handleCreateOreditActivity(activity: Activity) {
    //check if we have activity id:yes means update, no means create
    activity.id ?
      //[...activities.filter(x => x.id !== activity.id), activity] removing the activity from the activities list and add 
      //the update activity
      setActivities([...activities.filter(x => x.id !== activity.id), activity])
      //{...activity,id:uuid()}} --> get all the property inside activity and the id of the new created activity set it with a new uuid
      : setActivities([...activities, { ...activity, id: uuid() }]);
    setEditMode(false);
    //displaying the new activity
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }
  return (
    //the below lines looks like html but they are not, they are jsx(JavaScript XML)
    // <div className="App">

    //we will using fragment instead of a div to avoid rendering an empty div,and the reason we need somethign here
    //div or fragment is that it is not allowed to return two different elemnts inside the react component,NavBar
    //is an element and Container is an element, we can only add single element and have as many childs as we want 
    //inside it,we are not allowed to return two seperate elements at the same element so we need to add a div or fragment.
    //also a shorthand for <fragment> is empty tag <> and </>
    // <div> 
    <Fragment>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />{/*we can using javascript code/expression inside {}
        <u>
          {activities.map((activity: any) => (
            <li key={activity.id}>
              {activity.title}
            </li>
          ))}
        </u>
      </header> */}

      {/*removeing the below header and replace it with */}
      {/* <Header as='h2' icon='users' content='Reactivities'/> */}
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        {/* <List> */}
        {/* in the below line we have removed any in activities.map((activity: any),after adding Activity interface */}
        {/* {activities.map((activity) => (
          <List.Item key={activity.id}>
            {activity.title}
          </List.Item>
        ))} */}
        {/* </List> */}
        <ActivityDashboard

          /*we sepecifiying activities property to pass activities list into ActivityDashboard*/
          activities={activities}

          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOreditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
      {/* </div> */}
    </Fragment>
  );
}

export default App;
