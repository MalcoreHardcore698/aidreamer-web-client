import React, { useState, useEffect } from 'react'
import Query from '../ui/Query'
import Row from '../ui/Row'
import Form from '../ui/Form'
import Input from '../ui/Input'
import List from '../ui/List'
import TextArea from '../ui/TextArea'
import Toggler from '../ui/Toggler'
import { GET_ALL_STATUS, GET_ALL_ICONS, ADD_HUB, EDIT_HUB } from '../../utils/queries'
import { config } from '../../utils/config'

const api = config.get('api')

export default ({
    document,
    close,
    add=false,
    edit=false,
    editableStatus
}) => {
    const [variables, setVariables] = useState({})

    const [image, setImage] = useState(document?.icon)
    const [status, setStatus] = useState(document?.status)

    const variablesCompose = (form, options) => {
        return {
            ...options,
            ...variables,
            title: form.title,
            description: form.description,
            slogan: form.slogan,
            color: form.color
        }
    }

    useEffect(() => {
        const options = {
            icon: image.id,
            status
        }
        if (edit) options.id = document._id
        setVariables((vars) => ({
            ...vars,
            ...options
        }))
    }, [image, status, edit, document._id])

    return (
        <Form
            add={add}
            edit={edit}
            query={(add) ? ADD_HUB : EDIT_HUB}
            variables={variables}
            beforeEffect={(form, options) => variablesCompose(form, options)}
            afterEffect={close}
        >
            {({ elevate, register, loading }) => (
                <React.Fragment>
                    <Input options={{
                        ref: register({ required: true }),
                        type: 'text',
                        name: 'title',
                        defaultValue: document.title || '',
                        placeholder: 'Enter title',
                        disabled: loading
                    }} />
                    
                    <TextArea options={{
                        ref: register({ required: true }),
                        type: 'text',
                        name: 'description',
                        defaultValue: document.description || '',
                        placeholder: 'Enter description',
                        disabled: loading
                    }} />

                    <Input options={{
                        ref: register({ required: true }),
                        type: 'text',
                        name: 'slogan',
                        defaultValue: document.slogan || '',
                        placeholder: 'Enter slogan',
                        disabled: loading
                    }} />

                    <Input options={{
                        ref: register({ required: true }),
                        type: 'color',
                        name: 'slogan',
                        defaultValue: document.color || '',
                        placeholder: 'Enter color',
                        disabled: loading
                    }} />

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

                    <Query query={GET_ALL_ICONS} pseudo={{ count: 1, height: 45 }}>
                        {({ data }) => (
                            <List options={{
                                type: 'grid',
                                state: image,
                                list: data.allIcons,
                                handlerItem: (file) => {
                                    setImage(file)
                                    elevate()
                                }
                            }}>
                                {({ item }) => (
                                    <img
                                        className="image"
                                        src={(item.path).replace('./', `${api}/`)}
                                        alt="Hub"
                                    />
                                )}
                            </List>
                        )}
                    </Query>
                </React.Fragment>
            )}
        </Form>
    )
}