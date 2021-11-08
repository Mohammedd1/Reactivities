//193
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Divider, Grid, Header, Item, Segment, Statistic } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

//196
interface Props{
    profile:Profile;
}

export default observer(function ProfileHeader({profile}:Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile.followersCount /*229*/} />
                        <Statistic label='Following' value={profile.followingCount /*229*/} />
                    </Statistic.Group>
                    <Divider />{/*horizental line*/}
                   <FollowButton profile={profile}/>{/*231*/}
                </Grid.Column>

            </Grid>
        </Segment>
    )
})