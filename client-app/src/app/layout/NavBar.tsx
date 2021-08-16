//import React from 'react';//all react compnents imported from react,react components are react function that returns jsx
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, MenuItem, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../stores/store';
//import { useStore } from '../stores/store';

//We would need to make this an observer as well, because we need to know if the user object has been
//updated in our store.
export default observer(function NavBar() {
    //const{activityStore}=useStore();
    const { userStore: { user, logout } } = useStore();
    // return in the below will return a jsx 
    return (
        <Menu inverted fixed='top'>
            {/* Container will adding some padding inside the nav bar */}
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name='Activities' />
                <Menu.Item as={NavLink} to='/errors' name='Errors' />
                <Menu.Item>
                    {/* <Button onClick={()=>activityStore.openForm()} positive content='Create Activity'/>//positive=green button */}
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>
                <MenuItem position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`}
                             text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
})