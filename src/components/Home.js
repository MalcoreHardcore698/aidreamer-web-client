import React, { useState } from 'react'
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

import AddArticle from './content/AddArticle'
import EditArticle from './content/EditArticle'
import ViewArticle from './content/ViewArticle'
import DeleteEntries from './content/DeleteEntries'

import targets from '../stores/targets'

import { config } from '../utils/config'
import {
    GET_ALL_HUBS,
    GET_USER_ARTICLES,
    GET_ALL_ARTICLES,
    DELETE_ARTICLES,
    SUB_ALL_HUBS,
    SUB_ARTICLES,
    SUB_USER_ARTICLES
} from '../utils/queries'

const api = config.get('api')

export default ({ showModal }) => {
    const state = useSelector(state => state)

    const [currentHub, setCurrentHub] = useState('all')

    if (!state.user) return null
    
    return (
        <main className="home">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Aid</span>
                        <span>Reamer</span>
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
                                title: 'Add Article',
                                component: ({ jump, close }) => <AddArticle jump={jump} close={close} />
                            }
                        ])
                    }
                }}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>

                <Query query={GET_USER_ARTICLES} variables={{ id: state.user.id }}>
                    {({ data, refetch }) =>
                        <Subscription query={SUB_USER_ARTICLES} variables={{ id: state.user.id }} refetch={refetch}>
                            {({ subData }) => {
                                const articles = (subData && subData.articles) || (data && data.allUserArticles) || []

                                if (articles.length === 0)
                                    return <Message text="Empty" padding />

                                return (
                                    articles.map((article, key) => (
                                        <Entry key={key} options={{
                                            editable: true,
                                            capacious: false,
                                            statusBar: [
                                                { lite: 'Comments', dark: article.comments.length || 0 },
                                                { lite: 'Views', dark: article.views || 0 },
                                                {
                                                    lite: <Moment date={new Date(new Date().setTime(article.createdAt))} format="MMM, DD" />,
                                                    dark: <Moment date={new Date(new Date().setTime(article.createdAt))} format="h:m" />
                                                }
                                            ],
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
                                            <h2 className="title">{article.title}</h2>
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
                    name: 'articles',
                    title: 'Articles',
                    subtitle: 'All',
                    targets
                }}>
                    {({ filter }) => (
                        <div className="grid">
                            <Query query={GET_ALL_ARTICLES} variables={{ status: 'PUBLISHED' }} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_ARTICLES} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                                        {({ subData }) => {
                                            const articles = (subData && subData.articles) || (data && data.allArticles) || []

                                            if (articles.length === 0)
                                                return <Message text="Empty" padding />

                                            return (
                                                articles.map((article, key) => ((currentHub === 'all') || (article.hub.id === currentHub)) ? (
                                                    <Entry key={key} options={{
                                                        capacious: false,
                                                        userBar: {
                                                            name: article.author.name,
                                                            status: article.author.status || 'Online',
                                                            avatar: article.author.avatar?.path
                                                        },
                                                        statusBar: [
                                                            { lite: 'Comments', dark: article.comments.length || 0 },
                                                            { lite: 'Views', dark: article.views || 0 },
                                                            {
                                                                lite: <Moment date={new Date(new Date().setTime(article.createdAt))} format="MMM, DD" />,
                                                                dark: <Moment date={new Date(new Date().setTime(article.createdAt))} format="h:m" />
                                                            }
                                                        ],
                                                        handler: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: article.title,
                                                                component: () => <ViewArticle article={article} />
                                                            }
                                                        ])
                                                    }}>
                                                        {(article.image && article.image.path) &&
                                                            <img
                                                                className="image"
                                                                src={(article.image.path).replace('./', `${api}/`)}
                                                                alt="Article"
                                                            />
                                                        }
                                                        <h2 className="title">{article.title}</h2>
                                                        <p className="paragraph">{article.description}</p>
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