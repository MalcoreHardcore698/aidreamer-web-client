import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Query from '../ui/Query'
import Mutation from '../ui/Mutation'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import Select from '../ui/Select'
import Dropzone from '../ui/Dropzone'
import { GET_ALL_HUBS, ADD_ARTICLE } from '../../utils/queries'

export default ({ status=false, close }) => {
    const state = useSelector(state => state)
    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [body, setBody] = useState('')
    const [hub, setHub] = useState('')
    const [image, setImage] = useState('')
    const [_status, _setStatus] = useState('')

    return (
        <Container type="fat">
            <Input options={{
                type: 'text',
                placeholder: 'Enter title',
                onChange: (e) => {
                    setTitle(e.target.value)
                }
            }} />
            <Input options={{
                type: 'text',
                placeholder: 'Enter description',
                onChange: (e) => {
                    setDescription(e.target.value)
                }
            }} />
            <TextArea options={{
                placeholder: 'Enter body',
                onChange: (e) => {
                    setBody(e.target.value)
                }
            }} />

            <Query query={GET_ALL_HUBS}>
                {({ data }) => (
                    <Select options={{
                        value: hub,
                        options: data.allHubs.map(hub => ({
                            value: hub.id,
                            label: hub.title
                        })),
                        onChange: (e) => {
                            setHub(e)
                        }
                    }} />
                )}
            </Query>

            {(status) && <Select options={{
                value: _status,
                options: [
                    { value: 'MODERATION', label: 'MODERATION' },
                    { value: 'PUBLISHED', label: 'PUBLISHED' }
                ],
                onChange: (e) => {
                    _setStatus(e)
                }
            }} />}

            <Dropzone options={{
                name: 'image',
                image, setImage
            }} />

            <Mutation query={ADD_ARTICLE}>
                {({ action }) => (
                    <Button options={{
                        type: 'inactive',
                        handler: async () => {
                            const variables = {
                                author: state.user.id,
                                title, description,body,
                                hub: hub.value,
                                status: 'PUBLISHED'
                            }

                            if (image) variables.image = image
                            if (status) variables.status = _status

                            await action({ variables })

                            close()
                        }
                    }}>
                        <p>Add</p>
                    </Button>
                )}
            </Mutation>
        </Container>
    )
}