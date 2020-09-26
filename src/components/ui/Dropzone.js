import React, { useState } from 'react'
import Dropzone from 'react-dropzone-uploader'
import '../styles/Dropzone.css'

export default ({ options }) => {
    const [preview, setPreview] = useState('')

    const {
        type,
        name,
        setValue,
        register,
        styles={}
    } = options || {}

    const classes = [
        'ui-dropzone', type,
        (preview) ? ' with-preview' : ''
    ]

    const handleChangeStatus = ({ file, meta }, status) => {
        if (status === 'done') {
            setPreview(meta.previewUrl)
            setValue(name, file)
        }
    }

    return (
        <div className={classes.join(' ')} style={styles}>
            {(preview) && <div className="preview">
                <img src={preview} alt="Preview" />
            </div>}

            <Dropzone
                name={name}
                inputRef={register}
                maxFiles={1}
                multiple={false}
                onChangeStatus={handleChangeStatus}
                inputContent="Drag & Drop Image"
                accept="image/*"
            />
        </div>
    )
}