import React, { useState, useEffect } from 'react'
import Query from '../ui/Query'
import Row from '../ui/Row'
import Form from '../ui/Form'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import Toggler from '../ui/Toggler'
import Dropzone from '../ui/Dropzone'
import HubToggler from '../ui/HubToggler'
import { GET_ALL_STATUS, GET_ALL_POST_TYPES, ADD_POST, EDIT_POST } from '../../utils/queries'

export default ({
    document,
    close,
    add=false,
    edit=false,
    editableStatus
}) => {
    const [variables, setVariables] = useState({})

    const [hub, setHub] = useState(document?.hub)
    const [postType, setPostType] = useState(document?.type)
    const [preview, setPreview] = useState(null)
    const [status, setStatus] = useState(document?.status)

    const variablesCompose = (form, options) => {
        return {
            ...options,
            title: form.title,
            subtitle: form.subtitle,
            description: form.description,
            content: form.content
        }
    }

    useEffect(() => {
        const options = {
            type: postType
        }
        
        if (edit) options.id = document._id
        if (hub) options.hub = hub.id
        if (preview) options.preview = preview
        if (status) options.status = status
        else options.status = 'PUBLISHED'

        setVariables((vars) => ({
            ...vars,
            ...options
        }))
    }, [hub, preview, status, postType, edit, document])

    return (
        <Form
            wide
            add={add}
            edit={edit}
            query={(add) ? ADD_POST : EDIT_POST}
            variables={variables}
            beforeEffect={(form, options) => variablesCompose(form, options)}
            afterEffect={close}
        >
            {({ elevate, register, loading }) => (
                <React.Fragment>
                    <Input options={{
                        ref: register(),
                        type: 'text',
                        name: 'title',
                        defaultValue: document?.title || '',
                        placeholder: 'Enter title',
                        disabled: loading
                    }} />

                    <Input options={{
                        ref: register(),
                        type: 'text',
                        name: 'subtitle',
                        defaultValue: document?.subtitle || '',
                        placeholder: 'Enter subtitle',
                        disabled: loading
                    }} />

                    <Input options={{
                        ref: register(),
                        type: 'text',
                        name: 'description',
                        defaultValue: document?.description || '',
                        placeholder: 'Enter description',
                        disabled: loading
                    }} />

                    <TextArea options={{
                        ref: register(),
                        type: 'text',
                        name: 'content',
                        defaultValue: document?.content || '',
                        placeholder: 'Enter content',
                        disabled: loading
                    }} />

                    <HubToggler override={{
                        state: hub,
                        handler: (item) => {
                            setHub(item)
                            elevate()
                        }
                    }} slicedFactor={2} />

                    {(editableStatus) && <Query query={GET_ALL_STATUS}>
                        {({ data }) => (
                            <Toggler options={{
                                state: status,
                                handler: setStatus,
                                targets: [
                                    ...data.allStatus.map((item, key) => ({
                                        type: item,
                                        value: (
                                            <Row key={key}>
                                                <p>{item}</p>
                                            </Row>
                                        )}))
                                ]}}
                            />
                        )}
                    </Query>}

                    <Dropzone options={{
                        ref: register,
                        name: 'image',
                        setImage: setPreview
                    }} />
                    
                    <Query query={GET_ALL_POST_TYPES}>
                        {({ data }) => (
                            <Toggler options={{
                                state: postType,
                                handler: (item) => {
                                    setPostType(item)
                                    elevate()
                                },
                                targets: [
                                    ...data.allPostTypes.map((item, key) => ({
                                        type: item,
                                        value: (
                                            <Row key={key}>
                                                <p>{item}</p>
                                            </Row>
                                        )}))
                                ]}}
                            />
                        )}
                    </Query>
                </React.Fragment>
            )}
        </Form>
    )
}