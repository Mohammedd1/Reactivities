//import React from 'react';//all react compnents imported from react,react components are react function that returns jsx
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
//import { useStore } from '../stores/store';

export default function NavBar() {
    //const{activityStore}=useStore();
    
    // return in the below will return a jsx 
    return (
        <Menu inverted fixed='top'>
            {/* Container will adding some padding inside the nav bar */}
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight:'10px'}} />
                    Reactivities                    
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities'  name ='Activities'/>
                <Menu.Item as={NavLink} to='/errors'  name ='Errors'/>
                <Menu.Item>
                    {/* <Button onClick={()=>activityStore.openForm()} positive content='Create Activity'/>//positive=green button */}
                  
                    <Button as={NavLink} to='/createActivity'positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}