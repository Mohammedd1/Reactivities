//194
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfileAbout from './ProfileAbout';
import ProfilePhotos from './ProfilePhotos';
import ProfileFollowings from './ProfileFollowings';
import { useStore } from '../../app/stores/store';
//197
interface Props{
    profile:Profile;
}

//modified 207
export default observer(function ProfileContent({ profile }: Props) {
    
    const { profileStore } = useStore();//233

    const panes = [
        { menuItem: 'About', render: () => /*207*/<ProfileAbout />},
        { menuItem: 'Photos', render: () => /*197*/<ProfilePhotos profile={profile}/> },
        { menuItem: 'Event', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => /*232*/<ProfileFollowings/> },
        { menuItem: 'Following', render: () => /*232*/<ProfileFollowings/> },
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e,data) => profileStore.setActiveTab(data.activeIndex)}
         
        />
    )
})