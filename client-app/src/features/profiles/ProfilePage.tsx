//192
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileHeader from '../profiles/ProfileHeader';
import ProfileContent from '../profiles/ProfileContent';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { useParams } from 'react-router';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default observer(function ProfilePage() {

    const { username } = useParams<{ username: string }>();//196
    const { profileStore } = useStore();//196
    const { loadingProfile, loadProfile, profile } = profileStore;//196

    useEffect(() => {
        loadProfile(username);
    }, [loadProfile, username])

    if (loadingProfile) return <LoadingComponent content='Loading profile...' />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }

            </Grid.Column>
        </Grid>
    )
})