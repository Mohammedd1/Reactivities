import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    return (
        // <Container style={{marginTop:'7em'}}>
        //     <h1>Home page</h1>
        //     <h3>Go to <Link to='/activities'>Activities</Link></h3>
        // </Container>

        //Styliing the Homepage
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to reactivities' />
                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to Activities
                        </Button>
                    </>
                ) : (
                    // <Button as={Link} to='/login' size='huge' inverted>
                    //     Login!
                    // </Button>
                    //after adding modal
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                            Login!
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                            Register!
                        </Button>
                    </>
                )}

                {/* <Button as={Link} to='/activities' size='huge' inverted>
                    Take me to the Activities
                </Button> */}

            </Container>

        </Segment>
    )
})