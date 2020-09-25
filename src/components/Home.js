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
import ViewAlert from './views/Alert'
import ViewPost from './views/Post'
import targets from '../stores/targets'
import { config } from '../utils/config'
import {
    ADD_COMMENT,
    GET_ALL_POSTS,
    SUB_ALL_POSTS,
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
                    {() => (
                        <div className="grid">
                            <Query query={GET_ALL_POSTS} variables={{ status: 'PUBLISHED', type: 'ARTICLE' }} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_ALL_POSTS} variables={{ status: 'PUBLISHED', type: 'ARTICLE' }} refetch={refetch}>
                                        {({ subData }) => {
                                            const posts = (subData && subData.posts) || (data && data.allPosts) || []

                                            if (posts.length === 0)
                                                return <Message text="Empty" padding />

                                            return (
                                                posts.map((post, key) => ((state.filters.currentHub === 'all') || (post.hub.id === state.filters.currentHub.id)) ? (
                                                    <Entry key={key} options={{
                                                        capacious: false,
                                                        userBar: {
                                                            name: post.author.name,
                                                            status: post.author.status || 'Online',
                                                            avatar: post.author.avatar.path
                                                        },
                                                        statusBar: {
                                                            options: [
                                                                { lite: 'Comments', dark: post.comments.length },
                                                                { lite: 'Views', dark: post.views || 0 },
                                                                {
                                                                    lite: <Moment date={new Date(new Date().setTime(post.createdAt))} format="MMM, DD" />,
                                                                    dark: <Moment date={new Date(new Date().setTime(post.createdAt))} format="h:m" />
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
                                                                                                    post: post.id,
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
                                                                title: 'Post',
                                                                component: () => <ViewPost document={post} />
                                                            }
                                                        ])
                                                    }}>
                                                        {(post.preview && post.preview.path) &&
                                                            <img
                                                                className="image"
                                                                src={(post.preview.path).replace('./', `${api}/`)}
                                                                alt="Post"
                                                            />
                                                        }
                                                        <p className="tag" style={{ background: post.hub.color }}>{post.hub.title}</p>
                                                        <h2 className="title">{post.title}</h2>
                                                        <p className="paragraph">{post.description}</p>
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