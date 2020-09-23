import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComment
} from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment'

import Mutation from './ui/Mutation'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Row from './ui/Row'
import Headline from './ui/Headline'
import Button from './ui/Button'
import HubToggler from './ui/HubToggler'
import Section from './ui/Section'
import Message from './ui/Message'
import Entry from './ui/Entry'

import ViewOffer from './content/ViewOffer'
import ViewAlert from './content/ViewAlert'
import {
    OPEN_USER_CHAT,
    GET_ALL_OFFERS,
    SUB_ALL_OFFERS
} from '../utils/queries'
import { setChat } from '../utils/actions'
import targets from '../stores/targets'

export default ({ showModal }) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    if (!state.user) return null

    return (
        <main className="navigator">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Navigator</span>
                        <span>Search</span>
                    </Headline>
                </Row>
            </aside>

            <aside>
                <HubToggler all />

                <Section options={{
                    name: 'offers',
                    title: 'Offers',
                    targets, filter: true
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

                                            return (
                                                offers.map((offer, key) => ((state.filters.currentHub === 'all') || (offer.hub.id === state.filters.currentHub.id)) ? (
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
                                                        <p className="tag" style={{ background: offer.hub.color }}>{offer.hub.title}</p>
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
        </main>
    )
}