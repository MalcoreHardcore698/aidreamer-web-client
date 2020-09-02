import React from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment'

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
import DeleteEntries from './content/DeleteEntries'

import {
    GET_USER_OFFERS,
    GET_ALL_OFFERS,
    GET_ALL_HUBS,
    DELETE_OFFERS,
    SUB_USER_OFFERS,
    SUB_ALL_OFFERS,
    SUB_ALL_HUBS
} from '../utils/queries'

import targets from '../stores/targets'
import { config } from '../utils/config'

const api = config.get('api')

export default ({ showModal }) => {
    const state = useSelector(state => state)

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
                        type: 'icon',
                        state: 'inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                <Button options={{
                    type: 'inactive',
                    handler: () => {
                        showModal([
                            {
                                path: '/',
                                title: 'Add Offer',
                                component: ({ jump, close }) => <AddOffer jump={jump} close={close} />
                            }
                        ])
                    }
                }}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>

                <Query query={GET_USER_OFFERS} variables={{ id: state.user.id }}>
                    {({ data, refetch }) =>
                        <Subscription query={SUB_USER_OFFERS} variables={{ id: state.user.id }} refetch={refetch}>
                            {({ subData }) => {
                                const offers = (subData && subData.offers) || (data && data.allUserOffers) || []

                                if (offers.length === 0)
                                    return <Message text="Empty" padding />

                                return (
                                    offers.map((offer, key) => (
                                        <Entry key={key} options={{
                                            editable: true,
                                            capacious: false,
                                            statusBar: [
                                                {
                                                    lite: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="MMM, DD" />,
                                                    dark: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="h:m" />
                                                }
                                            ],
                                            handlerEdit: () => showModal([
                                                {
                                                    path: '/',
                                                    title: 'Edit Offer',
                                                    component: ({ close }) => <EditOffer offer={offer} close={close} />
                                                }
                                            ]),
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
                                            ])
                                        }}>
                                            <h2 className="title">{offer.title}</h2>
                                        </Entry>
                                    )
                                ))
                            }}
                        </Subscription>
                    }
                </Query>
            </aside>

            <aside>
                <Query query={GET_ALL_HUBS} variables={{ status: 'PUBLISHED' }}>
                    {({ data, refetch }) => (data.allHubs.length > 1) && (
                        <Subscription query={SUB_ALL_HUBS} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                            {({ subData }) => (
                                <Toggler options={{
                                    type: 'auto',
                                    targets: ((subData && subData.hubs) || (data && data.allHubs) || []).map((hub, key) => ({
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
                                    }}
                                />
                            )}
                        </Subscription>
                    )}
                </Query>

                <Section options={{
                    name: 'offers',
                    title: 'Offers',
                    subtitle: 'All',
                    targets
                }}>
                    <Query query={GET_ALL_OFFERS} variables={{ status: 'PUBLISHED' }}>
                        {({ data, refetch }) =>
                            <Subscription query={SUB_ALL_OFFERS} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                                {({ subData }) => {
                                    const offers = (subData && subData.offers) || (data && data.allOffers) || []

                                    if (offers.length === 0)
                                        return <Message text="Empty" padding />

                                    return (
                                        offers.map((offer, key) => 
                                            <Entry key={key} options={{
                                                capacious: false,
                                                userBar: {
                                                    name: offer.user.name,
                                                    status: offer.user.status || 'Online',
                                                    avatar: offer.user.avatar?.path
                                                },
                                                statusBar: [
                                                    {
                                                        lite: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="MMM, DD" />,
                                                        dark: <Moment date={new Date(new Date().setTime(offer.createdAt))} format="h:m" />
                                                    }
                                                ],
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
                                        )
                                    )
                                }}
                            </Subscription>
                        }
                    </Query>
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'invites',
                    title: 'Invites',
                    subtitle: 12,
                    manage: false
                }}>
                    
                </Section>
            </aside>
        </main>
    )
}