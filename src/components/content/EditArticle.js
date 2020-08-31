import React, { useState } from 'react'
import Query from '../ui/Query'
import Mutation from '../ui/Mutation'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import Select from '../ui/Select'
import Dropzone from '../ui/Dropzone'
import { GET_ALL_HUBS, EDIT_ARTICLE } from '../../utils/queries'

export default ({ status=false, article, close }) => {
    const [title, setTitle] = useState(article.title)
    const [description, setDescription] = useState(article.description)
    const [body, setBody] = useState(article.body)
    const [hub, setHub] = useState(article.hub.id)
    const [image, setImage] = useState('')
    const [_status, _setStatus] = useState(article.status)

    return (
        <Container>
            <Input options={{
                type: 'text',
                value: title,
                placeholder: 'Enter title',
                onChange: (e) => {
                    setTitle(e.target.value)
                }
            }} />
            <Input options={{
                type: 'text',
                value: description,
                placeholder: 'Enter description',
                onChange: (e) => {
                    setDescription(e.target.value)
                }
            }} />
            <TextArea options={{
                value: body,
                placeholder: 'Enter body',
                onChange: (e) => {
                    setBody(e.target.value)
                }
            }} />

            <Query query={GET_ALL_HUBS}>
                {({ data }) => (
                    <Select options={{
                        defaultValue: { value: article.hub.id, label: article.hub.title },
                        options: data.allHubs.map(hub => ({
                            value: hub.id,
                            label: hub.title
                        })),
                        onChange: (e) => {
                            setHub(e.value)
                        }
                    }} />
                )}
            </Query>

            {(status) && <Select options={{
                defaultValue: { value: _status, label: _status },
                options: [
                    { value: 'MODERATION', label: 'MODERATION' },
                    { value: 'PUBLISHED', label: 'PUBLISHED' }
                ],
                onChange: (e) => {
                    _setStatus(e.value)
                }
            }} />}

            <Dropzone options={{
                name: 'image',
                image, setImage
            }} />

            <Mutation query={EDIT_ARTICLE}>
                {({ action }) => (
                    <Button options={{
                        type: 'inactive',
                        handler: async () => {
                            const variables = {
                                id: article.id,
                                title, description,
                                body, hub
                            }

                            if (image) variables.image = image
                            if (status) variables.status = _status

                            console.log(variables)

                            await action({ variables })
                            if (close) close()
                        }
                    }}>
                        <p>Apply</p>
                    </Button>
                )}
            </Mutation>
        </Container>
    )
}