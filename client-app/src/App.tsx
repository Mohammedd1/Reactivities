import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header } from 'semantic-ui-react';
import { List } from 'semantic-ui-react'
function App() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    //calling get activities API
    axios.get('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    })
  }, [])
  return (
    //the below lines looks like html but they are not, they are jsx(JavaScript XML)
    // <div className="App">
    <div>
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
      <Header as='h2' icon='users' content='Reactivities'/>

      <List>
          
          {activities.map((activity: any) => (
              <List.Item key={activity.id}>
                {activity.title}
              </List.Item>
            ))}
          </List>
    </div>
  );
}

export default App;
