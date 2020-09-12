import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus, faComment } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment'

import Mutation from './ui/Mutation'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Row from './ui/Row'
import Headline from './ui/Headline'
import Button from './ui/Button'
import Search from './ui/Search'
import Toggler from './ui/Toggler'
import Section from './ui/Section'
import Message from './ui/Message'
import Entry from './ui/Entry'

import AddOffer from './content/AddOffer'
import EditOffer from './content/EditOffer'
import ViewOffer from './content/ViewOffer'
import ViewAlert from './content/ViewAlert'
import DeleteEntries from './content/DeleteEntries'

import {
    OPEN_USER_CHAT,
    GET_USER_OFFERS,
    GET_ALL_OFFERS,
    GET_ALL_HUBS,
    DELETE_OFFERS,
    SUB_USER_OFFERS,
    SUB_ALL_OFFERS,
    SUB_ALL_HUBS
} from '../utils/queries'

import { setChat } from '../utils/actions'

import targets from '../stores/targets'
import { config } from '../utils/config'

const api = config.get('api')

export default ({ showModal }) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const history = useHistory()

    const [currentHub, setCurrentHub] = useState('all')

    if (!state.user) return null

    return (
        <main className="navigator">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Navigator</span>
                        <span>Search</span>
                    </Headline>

                    <Button options={{
                        state: 'icon inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                <Button options={{
                    state: 'inactive',
                    classNames: 'stretch',
                    handler: () => {
                        showModal([
                            {
                                path: '/',
                                title: 'Add Offer',
                                component: ({ jump, close }) => <AddOffer jump={jump} close={close} />
                            }
                        ], true)
                    }
                }}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>

                <Query query={GET_USER_OFFERS}>
                    {({ data, refetch }) =>
                        <Subscription query={SUB_USER_OFFERS} refetch={refetch}>
                            {({ subData }) => {
                                const offers = (subData && subData.offers) || (data && data.allUserOffers) || []

                                if (offers.length === 0)
                                    return <Message text="Empty" padding />

                                return (
                                    offers.map((offer, key) => (
                                        <Entry key={key} options={{
                                            editable: true,
                                            capacious: false,
                                            statusBar: {
                                                options: [
                                                    {
                                                        lite: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="MMM, DD" />,
                                                        dark: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="h:m" />
                                                    }
                                                ]
                                            },
                                            handlerView: () => showModal([
                                                {
                                                    path: '/',
                                                    title: 'Offer',
                                                    component: ({ close }) => <ViewOffer offer={offer} close={close} />
                                                }
                                            ]),
                                            handlerEdit: () => showModal([
                                                {
                                                    path: '/',
                                                    title: 'Edit Offer',
                                                    component: ({ close }) => <EditOffer offer={offer} close={close} />
                                                }
                                            ], true),
                                            handlerDelete: () => showModal([
                                                {
                                                    path: '/',
                                                    title: 'Delete Offer',
                                                    component: ({ close }) => <DeleteEntries
                                                        entry={offer}
                                                        query={DELETE_OFFERS}
                                                        handler={async (action, entry, docs) => {
                                                            await action({
                                                                variables: {
                                                                    offers: (entry)
                                                                        ? [{
                                                                            id: entry.id,
                                                                            user: entry.user.id
                                                                        }]
                                                                        : docs.map(doc => ({
                                                                            id: doc.id,
                                                                            user: doc.user.id
                                                                        }))
                                                                }
                                                            })
                                                        }}
                                                        close={close}
                                                    />
                                                }
                                            ], true)
                                        }}>
                                            <h2 className="title">{offer.title}</h2>
                                            <p className="paragraph">{offer.hub.title}</p>
                                        </Entry>
                                    )
                                ))
                            }}
                        </Subscription>
                    }
                </Query>
            </aside>

            <aside>
                <Query query={GET_ALL_HUBS} variables={{ status: 'PUBLISHED' }} pseudo={{ height: 45, count: 6 }}>
                    {({ data, refetch }) => (data.allHubs.length > 1) && (
                        <Subscription query={SUB_ALL_HUBS} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                            {({ subData }) => {
                                const hubs = ((subData && subData.hubs) || (data && data.allHubs))
                                return (
                                    <Toggler options={{
                                        state: currentHub,
                                        handler: setCurrentHub,
                                        targets: [
                                            {
                                                type: 'all',
                                                value: <Row><p>All</p></Row>
                                            },
                                            ...hubs.map((hub, key) => ({
                                                type: hub.id,
                                                value: (
                                                    <Row key={key}>
                                                        {(hub.icon && hub.icon.path) &&
                                                        <div className="icon">
                                                            <img src={(hub.icon.path).replace('./', `${api}/`)} alt={hub.title} />
                                                        </div>}
                                                        <p>{hub.title}</p>
                                                    </Row>
                                                )}))
                                        ]}}
                                    />
                                )
                            }}
                        </Subscription>
                    )}
                </Query>

                <Section options={{
                    name: 'offers',
                    title: 'Offers',
                    subtitle: 'All',
                    targets
                }}>
                    {({ filter }) => (
                        <div className="grid">
                            <Query query={GET_ALL_OFFERS} variables={{ status: 'PUBLISHED' }} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_ALL_OFFERS} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                                        {({ subData }) => {
                                            const offers = (subData && subData.offers) || (data && data.allOffers) || []

                                            if (offers.length === 0)
                                                return <Message text="Empty" padding />

                                            console.log(offers)

                                            return (
                                                offers.map((offer, key) => ((currentHub === 'all') || (offer.hub.id === currentHub)) ? (
                                                    <Entry key={key} options={{
                                                        capacious: false,
                                                        userBar: {
                                                            name: offer.user.name,
                                                            status: offer.user.status || 'Online',
                                                            avatar: offer.user?.avatar?.path,
                                                            rightButton: (offer.user.name !== state.user.name) && (
                                                                <Mutation query={OPEN_USER_CHAT}>
                                                                    {({ action }) => (
                                                                        <Button options={{
                                                                            state: 'icon inactive',
                                                                            handler: async () => {
                                                                                try {
                                                                                    const chat = await action({
                                                                                        variables: {
                                                                                            name: offer.user.name
                                                                                        }
                                                                                    })
                                                                                    dispatch(setChat(chat.data.openUserChat))
                                                                                    history.push('/chats')
                                                                                } catch {
                                                                                    showModal([
                                                                                        {
                                                                                            path: '/',
                                                                                            title: 'Error',
                                                                                            component: ({ close }) => <ViewAlert
                                                                                                text="Ops! Wrong something :("
                                                                                                close={close}
                                                                                            />
                                                                                        }
                                                                                    ], true)
                                                                                }
                                                                            }
                                                                        }}>
                                                                            <FontAwesomeIcon icon={faComment} />
                                                                        </Button>
                                                                    )}
                                                                </Mutation>
                                                            )
                                                        },
                                                        statusBar: {
                                                            options: [
                                                                {
                                                                    lite: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="MMM, DD" />,
                                                                    dark: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="h:m" />
                                                                }
                                                            ]
                                                        },
                                                        handler: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: offer.title,
                                                                component: () => <ViewOffer offer={offer} />
                                                            }
                                                        ])
                                                    }}>
                                                        <h2 className="title">{offer.title}</h2>
                                                        <p>{offer.message}</p>
                                                    </Entry>
                                                ) : null)
                                            )
                                        }}
                                    </Subscription>
                                }
                            </Query>
                        </div>
                    )}
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'invites',
                    title: 'Invites',
                    subtitle: 12,
                    manage: false
                }}>
                    {() => (
                        null
                    )}
                </Section>
            </aside>
        </main>
    )
}