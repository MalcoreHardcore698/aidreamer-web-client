import React from 'react'
import { useSelector } from 'react-redux'
import Moment from 'react-moment'

import Query from './ui/Query'
import Mutation from './ui/Mutation'
import Subscription from './ui/Subscription'
import Row from './ui/Row'
import Avatar from './ui/Avatar'
import Input from './ui/Input'
import Headline from './ui/Headline'
import HubToggler from './ui/HubToggler'
import Section from './ui/Section'
import Message from './ui/Message'
import Entry from './ui/Entry'

import ViewAlert from './content/ViewAlert'
import ViewArticle from './content/ViewArticle'

import targets from '../stores/targets'

import { config } from '../utils/config'
import {
    GET_ALL_ARTICLES,
    ADD_COMMENT,
    SUB_ARTICLES,
} from '../utils/queries'

const api = config.get('api')

export default ({ showModal }) => {
    const state = useSelector(state => state)

    if (!state.user) return null
    
    return (
        <main className="home">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Aid</span>
                        <span>Reamer</span>
                    </Headline>
                </Row>
            </aside>

            <aside>
                <HubToggler all />

                <Section options={{
                    name: 'articles',
                    title: 'Articles',
                    targets, filter: true
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
                                                articles.map((article, key) => ((state.filters.currentHub === 'all') || (article.hub.id === state.filters.currentHub.id)) ? (
                                                    <Entry key={key} options={{
                                                        capacious: false,
                                                        userBar: {
                                                            name: article.author.name,
                                                            status: article.author.status || 'Online',
                                                            avatar: article.author.avatar.path
                                                        },
                                                        statusBar: {
                                                            options: [
                                                                { lite: 'Comments', dark: article.comments.length },
                                                                { lite: 'Views', dark: article.views || 0 },
                                                                {
                                                                    lite: <Moment date={new Date(new Date().setTime(article.createdAt))} format="MMM, DD" />,
                                                                    dark: <Moment date={new Date(new Date().setTime(article.createdAt))} format="h:m" />
                                                                }
                                                            ],
                                                            input: (
                                                                <React.Fragment>
                                                                    <Avatar avatar={state?.user?.avatar} properties={['circle']} />
                                                                    <Mutation query={ADD_COMMENT}>
                                                                        {({ action }) => (
                                                                            <Input options={{
                                                                                onKeyPress: async (e) => {
                                                                                    try {
                                                                                        if (e.key === 'Enter') {
                                                                                            e.persist()
                                                                                            
                                                                                            const text = e.target.value
                                                                                            e.target.value = ''
                                                
                                                                                            await action({
                                                                                                variables: {
                                                                                                    article: article.id,
                                                                                                    text
                                                                                                }
                                                                                            })
                                                                                        }
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
                                                                            }} />
                                                                        )}
                                                                    </Mutation>
                                                                </React.Fragment>
                                                            ),
                                                        },
                                                        handler: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: 'Article',
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
                                                        <p className="tag" style={{ background: article.hub.color }}>{article.hub.title}</p>
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