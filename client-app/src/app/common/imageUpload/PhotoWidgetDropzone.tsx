//200
//below code is copied from https://github.com/react-dropzone/react-dropzone --> Usage
//but we made our changes in the code
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react'

//201
interface Props {
    setFiles: (files: any) => void;

}

export default function PhotoWidgetDropzone({ setFiles }: Props) {

    //201
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 200
    }
    //201
    const dzActive = {
        borderColor: 'green'
    }

    const onDrop = useCallback(acceptedFiles => {
        //201
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [setFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' />
            <Header content='Drop image here' />
        </div>
    )
}
