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
import ViewAlert from './views/Alert'
import ViewPost from './views/Post'
import {
    OPEN_USER_CHAT,
    GET_ALL_POSTS,
    SUB_ALL_POSTS
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
                    {() => (
                        <div className="grid">
                            <Query query={GET_ALL_POSTS} variables={{ status: 'PUBLISHED', type: 'OFFER' }} pseudo={{ height: 256, count: 3 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_ALL_POSTS} variables={{ status: 'PUBLISHED', type: 'OFFER' }} refetch={refetch}>
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
                                                            avatar: post.author.avatar.path,
                                                            rightButton: (post.author.name !== state.user.name) && (
                                                                <Mutation query={OPEN_USER_CHAT}>
                                                                    {({ action }) => (
                                                                        <Button options={{
                                                                            state: 'icon inactive',
                                                                            handler: async () => {
                                                                                try {
                                                                                    const chat = await action({
                                                                                        variables: {
                                                                                            name: post.author.name
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
                                                                    lite: <Moment date={new Date(new Date().setTime(post.createdAt))} format="MMM, DD" />,
                                                                    dark: <Moment date={new Date(new Date().setTime(post.createdAt))} format="h:m" />
                                                                }
                                                            ]
                                                        },
                                                        handler: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: post.title,
                                                                component: () => <ViewPost document={post} />
                                                            }
                                                        ])
                                                    }}>
                                                        <p className="tag" style={{ background: post.hub.color }}>{post.hub.title}</p>
                                                        <h2 className="title">{post.title}</h2>
                                                        <p>{post.content}</p>
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