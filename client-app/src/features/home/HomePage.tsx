import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';


export default function HomePage() {
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
                <Header as='h2' inverted content='Welcome to reactivities' />
                <Button as={Link} to='/activities' size='huge' inverted>
                    Take me to the Activities
                </Button>

            </Container>

        </Segment>
    )
}