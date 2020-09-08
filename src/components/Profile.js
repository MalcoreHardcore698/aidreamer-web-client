import React, { useState } from 'react'
import Moment from 'react-moment'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Row from './ui/Row'
import Container from './ui/Container'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Headline from './ui/Headline'
import Message from './ui/Message'
import Achievement from './ui/Achievement'
import Toggler from './ui/Toggler'
import Button from './ui/Button'
import Section from './ui/Section'
import Notify from './ui/Notify'
import Entry from './ui/Entry'

import ViewArticle from './content/ViewArticle'
import ViewOffer from './content/ViewOffer'
import AddArticle from './content/AddArticle'
import AddOffer from './content/AddOffer'
import EditArticle from './content/EditArticle'
import EditOffer from './content/EditOffer'
import DeleteEntries from './content/DeleteEntries'

import {
    GET_ALL_HUBS,
    GET_USER_ARTICLES,
    GET_USER_OFFERS,
    GET_USER_NOTIFICATIONS,
    DELETE_ARTICLES,
    DELETE_OFFERS,
    SUB_ALL_HUBS,
    SUB_USER_ARTICLES,
    SUB_USER_OFFERS,
    SUB_NOTIFICATIONS
} from '../utils/queries'

import targets from '../stores/targets'
import achievements from '../stores/achievements'
import { config } from '../utils/config'

const api = config.get('api')

const EntryContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal }) => {
    const state = useSelector(state => state)

    const [currentHub, setCurrentHub] = useState('all')

    if (!state.user) return null

    return (
        <main className="profile">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Malcore</span>
                        <span>Profile</span>
                    </Headline>
                </Row>

                <Section options={{
                    name: 'achievement',
                    title: 'Achievements',
                    subtitle: achievements.length,
                    manage: false
                }}>
                    {() => (
                        <div className="grid">
                            {achievements.map((achievement, key) =>
                                <Achievement key={key} options={{
                                    achievement,
                                    handler: () => showModal([
                                        {
                                            path: '/',
                                            title: 'Achievement',
                                            component: () => <EntryContent />
                                        }
                                    ], true)
                                }} />    
                            )}
                        </div>
                    )}
                </Section>
            </aside>

            <aside>
            <Query query={GET_ALL_HUBS} variables={{ status: 'PUBLISHED' }} pseudo={{ height: 45, count: 6 }}>
                    {({ data, refetch }) => (data.allHubs && data.allHubs.length > 1) && (
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
                    name: 'my-offers',
                    title: 'My Offers',
                    subtitle: '',
                    targets
                }}>
                    {({ filter }) => (
                        <React.Fragment>
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
                                    ])
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            <Query query={GET_USER_OFFERS} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_USER_OFFERS} refetch={refetch}>
                                        {({ subData }) => {
                                            const offers = ((subData && subData.offers) || data.allUserOffers)

                                            if (offers.length === 0)
                                                return <Message text="Empty" padding />

                                            return (
                                                <div className="grid">
                                                    {offers.map((offer, key) => ((currentHub === 'all') || (offer.hub.id === currentHub)) ? (
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
                                                        </Entry>
                                                    ) : null
                                                )}
                                            </div>)
                                        }}
                                    </Subscription>
                                }
                            </Query>
                        </React.Fragment>
                    )}
                </Section>

                <Section options={{
                    name: 'my-articles',
                    title: 'My Articles',
                    subtitle: '',
                    targets
                }}>
                    {({ filter }) => (
                        <React.Fragment>
                            <Button options={{
                                state: 'inactive',
                                classNames: 'stretch',
                                handler: () => {
                                    showModal([
                                        {
                                            path: '/',
                                            title: 'Add Article',
                                            component: ({ jump, close }) => <AddArticle jump={jump} close={close} />
                                        }
                                    ])
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            
                            <Query query={GET_USER_ARTICLES} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_USER_ARTICLES} refetch={refetch}>
                                        {({ subData }) => {
                                            const articles = ((subData && subData.articles) || data.allUserArticles)

                                            if (articles.length === 0)
                                                return <Message text="Empty" padding />

                                            return (
                                                <div className="grid">
                                                    {articles.map((article, key) => ((currentHub === 'all') || (article.hub.id === currentHub)) ? (
                                                        <Entry key={key} options={{
                                                            editable: true,
                                                            capacious: false,
                                                            manageOffset: !(article.image && !article.image.path),
                                                            statusBar: {
                                                                options: [
                                                                    { lite: 'Comments', dark: article.comments.length || 0 },
                                                                    { lite: 'Views', dark: article.views || 0 },
                                                                    {
                                                                        lite: <Moment date={new Date(new Date().setTime(article.createdAt))} format="MMM, DD" />,
                                                                        dark: <Moment date={new Date(new Date().setTime(article.createdAt))} format="h:m" />
                                                                    }
                                                                ]
                                                            },
                                                            handlerView: () => showModal([
                                                                {
                                                                    path: '/',
                                                                    title: 'Article',
                                                                    component: ({ close }) => <ViewArticle article={article} close={close} />
                                                                }
                                                            ]),
                                                            handlerEdit: () => showModal([
                                                                {
                                                                    path: '/',
                                                                    title: 'Edit Article',
                                                                    component: ({ close }) => <EditArticle article={article} close={close} />
                                                                }
                                                            ]),
                                                            handlerDelete: () => showModal([
                                                                {
                                                                    path: '/',
                                                                    title: 'Delete Article',
                                                                    component: ({ close }) => <DeleteEntries
                                                                        entry={article}
                                                                        query={DELETE_ARTICLES}
                                                                        handler={async (action, entry, docs) => {
                                                                            await action({
                                                                                variables: {
                                                                                    articles: (entry)
                                                                                        ? [{
                                                                                            id: entry.id,
                                                                                            author: entry.author.id
                                                                                        }]
                                                                                        : docs.map(doc => ({
                                                                                            id: doc.id,
                                                                                            author: doc.author.id
                                                                                        }))
                                                                                }
                                                                            })
                                                                        }}
                                                                        close={close}
                                                                    />
                                                                }
                                                            ], true)
                                                        }}>
                                                            {(article.image && article.image.path) && <img
                                                                    className="image"
                                                                    src={(article.image.path).replace('./', `${api}/`)}
                                                                    alt="Article"
                                                                />
                                                            }
                                                            <h2 className="title">{article.title}</h2>
                                                            <p className="paragraph">{article.description}</p>
                                                        </Entry>
                                                    ) : null)}
                                                </div>
                                            )
                                        }}
                                    </Subscription>
                                }
                            </Query>
                        </React.Fragment>
                    )}
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'notifications',
                    title: 'Notifications',
                    subtitle: '',
                    manage: false
                }}>
                    {() => (
                        <Query query={GET_USER_NOTIFICATIONS} pseudo={{ height: 45, count: 6 }}>
                            {({ data, refetch }) => (
                                <Subscription query={SUB_NOTIFICATIONS} refetch={refetch}>
                                    {({ subData }) => {
                                        const notifications = ((subData && subData.notifications) || data.allUserNotifications)

                                        if (notifications.length === 0)
                                            return <Message text="Empty" padding />

                                        return (
                                            <div className="grid">
                                                {notifications.map((notification, key) =>
                                                    <Notify key={key} options={{
                                                        message: notification.text,
                                                        avatar: notification.img
                                                    }} />    
                                                )}
                                            </div>
                                        )
                                    }}
                                </Subscription>
                            )}
                        </Query>
                    )}
                </Section>
            </aside>
        </main>
    )
}