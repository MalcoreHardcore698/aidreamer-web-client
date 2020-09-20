import React from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment'
import Row from './ui/Row'
import Container from './ui/Container'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Headline from './ui/Headline'
import Message from './ui/Message'
import Act from './ui/Act'
import HubToggler from './ui/HubToggler'
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
    GET_USER_ACTS,
    GET_USER_ARTICLES,
    GET_USER_OFFERS,
    GET_USER_NOTIFICATIONS,
    DELETE_ARTICLES,
    DELETE_OFFERS,
    SUB_USER_ACTS,
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

    if (!state.user) return null

    return (
        <main className="profile">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>{state.user.name}</span>
                        <span>Profile</span>
                    </Headline>
                </Row>

                <Query query={GET_USER_ACTS} pseudo={{ height: 70, count: 3 }}>
                    {({ data, refetch }) =>
                        <Subscription query={SUB_USER_ACTS} refetch={refetch}>
                            {({ subData }) => {
                                const userActs = ((subData && subData.userActs) || data.allUserActs)

                                if (userActs.length === 0)
                                    return <Message text="Empty" padding />

                                return (
                                    <Section options={{
                                        name: 'acts',
                                        title: 'Acts',
                                        subtitle: userActs.length,
                                        manage: false
                                    }}>
                                        {() => (userActs.length === 0)
                                            ? <Message text="Empty" padding />
                                            : (
                                                <div className="grid">
                                                    {userActs.map((userAct) =>
                                                        <Act key={userAct.id} options={{
                                                            act: userAct.act,
                                                            handler: () => showModal([
                                                                {
                                                                    path: '/',
                                                                    title: 'Act',
                                                                    component: () => <EntryContent />
                                                                }
                                                            ], true)
                                                        }} />    
                                                    )}
                                                </div>
                                            )
                                        }
                                    </Section>
                                )
                            }}
                        </Subscription>
                    }
                </Query>
            </aside>

            <aside>
                <HubToggler all />

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
                                                    {offers.map((offer, key) => ((state.filters.currentHub === 'all') || (offer.hub.id === state.filters.currentHub.id)) ? (
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
                                                            <p className="tag" style={{ background: offer.hub.color }}>{offer.hub.title}</p>
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
                                                    {articles.map((article, key) => ((state.filters.currentHub === 'all') || (article.hub.id === state.filters.currentHub.id)) ? (
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
                                                            <p className="tag" style={{ background: article.hub.color }}>{article.hub.title}</p>
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
                                                        avatar: notification.user?.avatar?.path
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