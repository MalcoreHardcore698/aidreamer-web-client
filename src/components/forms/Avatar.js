import React, { useState, useEffect } from 'react'
import Query from '../ui/Query'
import Row from '../ui/Row'
import Form from '../ui/Form'
import HubToggler from '../ui/HubToggler'
import Toggler from '../ui/Toggler'
import Dropzone from '../ui/Dropzone'
import { GET_ALL_RARITIES, ADD_AVATAR, EDIT_AVATAR } from '../../utils/queries'

export default ({
    document,
    close,
    add=false,
    edit=false
}) => {
    const [variables, setVariables] = useState({})

    const[hub, setHub] = useState(document?.hub)
    const[image, setImage] = useState(document?.image)
    const[rarity, setRarity] = useState(document?.rarity)

    useEffect(() => {
        const options = {
            rarity,
            hub: hub.id,
            file: image
        }
        if (edit) options.id = document._id
        setVariables((vars) => ({
            ...vars,
            ...options
        }))
    }, [preview, status, postType, edit, document._id])

    return (
        <Form
            add={add}
            edit={edit}
            query={(add) ? ADD_AVATAR : EDIT_AVATAR}
            variables={variables}
            afterEffect={close}
        >
            {({ elevate, register }) => (
                <React.Fragment>
                    <p className="ui-title">Image</p>
                    <Dropzone options={{
                        ref: register,
                        type: 'icon',
                        name: 'image',
                        value: document.path,
                        setImage: (file) => {
                            setImage(file)
                            elevate()
                        }
                    }} />

                    <p className="ui-title">Rarity</p>
                    <Query query={GET_ALL_RARITIES}>
                        {({ data }) => (
                            <Toggler options={{
                                state: rarity,
                                handler: (item) => {
                                    setRarity(item)
                                    elevate()
                                },
                                targets: [
                                    ...data.allRarities.map((item, key) => ({
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
                    
                    <p className="ui-title">Hub</p>
                    <HubToggler override={{
                        state: hub,
                        handler: (item) => {
                            setHub(item)
                            elevate()
                        }
                    }} />
                </React.Fragment>
            )}
        </Form>
    )
}