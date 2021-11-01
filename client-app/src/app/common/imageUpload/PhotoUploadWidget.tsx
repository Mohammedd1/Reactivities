
//199
import React, { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from '../imageUpload/PhotoWidgetDropzone';
import PhotoWidgetCropper from '../imageUpload/PhotoWidgetCropper';


//203
interface Props{
    loading:boolean;
    uploadPhoto:(file:Blob) => void;
}
export default function PhotoUploadWidget({loading,uploadPhoto}:Props) {
    const [files, setFiles] = useState<any>([]);//201

    const [cropper, setCropper] = useState<Cropper>();//202
    //202
    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));//modified on 203
        }
    }
    //202
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {
                    //201 
                    files && files.length > 0 && (
                        //202
                        <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    )
                }
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload' />
                {//202
                files && files.length > 0 &&
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group widths={2}>                            
                            <Button loading={loading} onClick={onCrop} positive icon='check' />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                        </Button.Group>
                    </>
                }

            </Grid.Column>
        </Grid>
    )
}