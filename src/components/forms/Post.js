import React, { useState, useEffect } from 'react'
import Query from '../ui/Query'
import Row from '../ui/Row'
import Form from '../ui/Form'
import Input from '../ui/Input'
import Avatar from '../ui/Avatar'
import TextArea from '../ui/TextArea'
import Toggler from '../ui/Toggler'
import Dropzone from '../ui/Dropzone'
import {
    GET_ALL_STATUS,
    GET_ALL_HUBS,
    ADD_POST,
    EDIT_POST
} from '../../utils/queries'

export default ({
    document,
    close,
    type,
    add=false,
    edit=false,
    isTitle,
    isSubtitle,
    isDescription,
    isContent,
    isHub,
    isStatus,
    isPreview
}) => {
    const [variables, setVariables] = useState({})

    const variablesCompose = (form, options) => {
        const vars = {
            ...options, type,
            title: form.title,
            status: form.status
        }
        
        if (form.subtitle) vars.subtitle = form.subtitle
        if (form.description) vars.description = form.description
        if (form.content) vars.content = form.content
        if (form.preview) vars.preview = form.preview
        if (form.hub) vars.hub = form.hub

        return vars
    }

    useEffect(() => {
        const options = {}

        if (edit) options.id = document._id
        else options.status = 'PUBLISHED'

        setVariables((vars) => ({
            ...vars,
            ...options
        }))
    }, [edit, document])

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
            {({ register, loading, setValue }) => (
                <React.Fragment>
                    {(isTitle) && <Input options={{
                        type: 'text',
                        name: 'title',
                        inputRef: register(),
                        defaultValue: document?.title || '',
                        placeholder: 'Enter title',
                        disabled: loading
                    }} />}

                    {(isSubtitle && (type === 'ARTICLE')) && <Input options={{
                        type: 'text',
                        name: 'subtitle',
                        inputRef: register(),
                        defaultValue: document?.subtitle || '',
                        placeholder: 'Enter subtitle',
                        disabled: loading
                    }} />}

                    {(isDescription && (type === 'ARTICLE')) && <Input options={{
                        type: 'text',
                        name: 'description',
                        inputRef: register(),
                        defaultValue: document?.description || '',
                        placeholder: 'Enter description',
                        disabled: loading
                    }} />}

                    {(isContent) && <TextArea options={{
                        type: 'text',
                        name: 'content',
                        inputRef: register(),
                        defaultValue: document?.content || '',
                        placeholder: 'Enter content',
                        disabled: loading
                    }} />}

                    {(isHub) && <Query query={GET_ALL_HUBS} pseudo={{ height: 45, count: 6 }}>
                        {({ data }) => (
                            <Toggler options={{
                                name: 'hub', setValue,
                                register: register(),
                                initialSlicedFactor: 2,
                                initialOptions: data.allHubs.map(hub => ({
                                    value: hub.id,
                                    label: (
                                        <Row key={hub.id}>
                                            <Avatar avatar={{ path: hub.icon.path }} properties={['circle']} />
                                            <p>{hub.title}</p>
                                        </Row>
                                    )
                                }))
                            }} />
                        )}
                    </Query>}

                    {(isStatus) && <Query query={GET_ALL_STATUS}>
                        {({ data }) => (
                            <Toggler options={{
                                name: 'status', setValue,
                                register: register(),
                                initialOptions: data.allStatus.map((item, key) => ({
                                    value: item,
                                    label: (
                                        <Row key={key}>
                                            <p>{item}</p>
                                        </Row>
                                    )}))
                            }}/>
                        )}
                    </Query>}

                    {(isPreview && (type === 'ARTICLE')) && <Dropzone
                        options={{
                            name: 'preview', setValue,
                            register: register()
                        }}
                    />}
                </React.Fragment>
            )}
        </Form>
    )
}