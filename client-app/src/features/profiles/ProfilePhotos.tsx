//197
import React, { SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';

//197
interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
    //198
    const { profileStore: { isCurrentUser, uploadPhoto, uploading,
        loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    //204
    const [target, setTarget] = useState('');
    //203
    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }
    //204
    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }
    //205
    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {
                        isCurrentUser && (
                            <Button floated='right' basic
                                content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                                onClick={() => setAddPhotoMode(!addPhotoMode)} />
                        )
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (

                        //<PhotoUploadWidget />
                        //203
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (

                        <Card.Group itemsPerRow={5}>
                            {
                                profile.photos?.map(photo => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {//204
                                            isCurrentUser && (
                                                <Button.Group fluid width={2}>
                                                    <Button
                                                        basic
                                                        color='green'
                                                        content='Main'
                                                        name={'main' + photo.id} //modified 205
                                                        disabled={photo.isMain}
                                                        loading={target === 'main' + photo.id && loading} //modified 205
                                                        onClick={e => handleSetMainPhoto(photo, e)}
                                                    />
                                                    <Button
                                                        //modified 205
                                                        basic
                                                        color='red'
                                                        icon='trash'
                                                        loading={target === photo.id && loading}
                                                        onClick={e => handleDeletePhoto(photo, e)}
                                                        disabled={photo.isMain}
                                                        name={photo.id}
                                                    />

                                                </Button.Group>
                                            )

                                        }
                                    </Card>
                                ))}
                        </Card.Group>
                    )

                    }
                </Grid.Column>

            </Grid>


        </Tab.Pane>


    )
})