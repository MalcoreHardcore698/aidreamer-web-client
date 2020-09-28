import React from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCompass, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbarWithChildren, buildStyles  } from 'react-circular-progressbar'
import Moment from 'react-moment'
import Row from './ui/Row'
import Column from './ui/Column'
import Container from './ui/Container'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Avatar from './ui/Avatar'
import Frame from './ui/Frame'
import Headline from './ui/Headline'
import Message from './ui/Message'
import Act from './ui/Act'
import List from './ui/List'
import Button from './ui/Button'
import Section from './ui/Section'
import Entry from './ui/Entry'
import HubToggler from './ui/HubToggler'
import CounterBadge from './ui/CounterBadge'
import ViewPost from './views/Post'
import FormPost from './forms/Post'
import DeleteEntries from './forms/Delete'
import {
    GET_ALL_POST_TYPES,
    GET_USER_ACTS,
    GET_USER_POSTS,
    DELETE_POSTS,
    SUB_USER_ACTS,
    SUB_USER_POSTS,
} from '../utils/queries'
import SVGExpIcon from '../assets/images/exp-icon.svg'
import SVGGemIcon from '../assets/images/gem-icon.svg'
import targets from '../stores/targets'
import { config } from '../utils/config'
import 'moment/locale/ru'
import _ from 'lodash'

const api = config.get('api')

function getPostIcon(type) {
    if (type === 'ARTICLE')
        return faPencilAlt
    else
        return faCompass
}

function Separator(props) {
    return (
      <div
        style={{
          position: "absolute",
          height: "100%",
          transform: `rotate(${props.turns}turn)`
        }}
      >
        <div style={props.style} />
      </div>
    )
  }
  
function RadialSeparators(props) {
    const turns = 1 / props.count;
    return _.range(props.count).map(index => (
        <Separator key={index} turns={index * turns} style={props.style} />
    ))
}

const EntryContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

const Head = () => {
    const state = useSelector(state => state)

    if (!state.user) return null

    return (
        <Row>
            <div className="circle">
                <Avatar avatar={{ path: state.user.avatar.path }} properties={['circle']} />
                
                <div className="exp">
                    <CircularProgressbarWithChildren
                        value={state.user.experience}
                        strokeWidth={2}
                        circleRatio={.85}
                        styles={buildStyles({
                            strokeLinecap: 'butt',
                            pathColor: 'var(--color-accent)',
                            rotation: 0.575,
                        })}
                    >
                        <RadialSeparators
                            count={16}
                            style={{
                                background: 'var(--color-body-background)',
                                width: '10px',
                                // This needs to be equal to props.strokeWidth
                                height: `${20}%`
                            }}
                        />
                    </CircularProgressbarWithChildren>
                </div>

                <CounterBadge options={{
                    count: state.user.level || 0
                }} />
            </div>

            <div className="info">
                <Row type="flex sb">
                    <Headline>
                        <span>{state.user.name}</span>
                        <span>Profile</span>
                    </Headline>

                    <Row type="flex auto">
                        <div className="user-experience">
                            <p className="value">{state.user.experience || 0}</p>
                            <p className="icon"><img src={SVGExpIcon} alt="Icon" /></p>
                        </div>
                        <div className="user-gem">
                            <p className="value">{state.user.gems || 0}</p>
                            <p className="icon"><img src={SVGGemIcon} alt="Icon" /></p>
                        </div>
                    </Row>
                </Row>
                
                <Frame value={state.user.status || 'What\'s up?'} legend="Status" />

                <Query query={GET_USER_POSTS} pseudo={{ height: 70, count: 3 }}>
                    {({ data }) => {
                        const posts = data.allUserPosts || []

                        const countOffers = posts.filter((post) => post.type === 'OFFER').length
                        const countArticles = posts.filter((post) => post.type === 'ARTICLE').length
                        const countTours = posts.filter((post) => post.type === 'TOUR').length

                        return (
                            <Row type="flex">
                                <div className="user-overview">
                                    <div className="user-overview-stat">
                                        <p className="value">{countOffers}</p>
                                        <p className="legend">Offers</p>
                                    </div>
                                    <div className="user-overview-stat">
                                        <p className="value">{countArticles}</p>
                                        <p className="legend">Articles</p>
                                    </div>
                                    <div className="user-overview-stat">
                                        <p className="value">{countTours}</p>
                                        <p className="legend">Tours</p>
                                    </div>
                                </div>
    
                                <div className="user-preferences">
                                    {state.user.preferences.map(pref =>
                                        <div key={pref.id} className="user-preference">
                                            <Avatar avatar={{ path: pref.icon.path }} properties={['circle']} />
                                        </div>
                                    )}
                                </div>
                            </Row>
                        )
                    }}
                </Query>
            </div>
        </Row>
    )
}

const Content = ({ showModal }) => {
    const state = useSelector(state => state)

    return (
        <Row>
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
                                    manage: false
                                }}>
                                    {() => (userActs.length === 0)
                                        ? <Message text="Empty" padding />
                                        : (
                                            <div className="grid">
                                                {userActs.map((userAct) =>
                                                    <Act key={userAct.id} options={{
                                                        act: userAct,
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

            <Section options={{
                name: 'activity',
                title: 'Activity',
                subtitle: '',
                targets, filter: true
            }}>
                {() => (
                    <React.Fragment>
                        <Query query={GET_ALL_POST_TYPES} pseudo={{ height: 40, count: 1 }}>
                            {({ data }) => (
                                <Button options={{
                                    state: 'inactive',
                                    classNames: 'stretch',
                                    handler: () => {
                                        showModal([
                                            {
                                                path: '/',
                                                title: 'Choose your type post',
                                                component: ({ jump }) => (
                                                    <Container>
                                                        <List options={{
                                                            type: 'grid stretch center',
                                                            list: data.allPostTypes.map(postType => ({
                                                                id: `/add/${postType.toLowerCase()}`,
                                                                label: postType,
                                                                icon: getPostIcon(postType)
                                                            })),
                                                            handlerItem: (item) => {
                                                                jump(item.id)
                                                            }
                                                        }}>
                                                            {({ item }) => (
                                                                <Container>
                                                                    <Column>
                                                                        <div className="icon large">
                                                                            <FontAwesomeIcon icon={item.icon} />
                                                                        </div>
                                                                        <p className="name">{item.label}</p>
                                                                    </Column>
                                                                </Container>
                                                            )}
                                                        </List>
                                                    </Container>
                                                ),
                                            },
                                            {
                                                path: '/add/article',
                                                title: 'Add Article',
                                                component: ({ close, back }) => <FormPost
                                                    add
                                                    type="ARTICLE"
                                                    close={close}
                                                    back={back}
                                                    isTitle
                                                    isSubtitle
                                                    isDescription
                                                    isContent
                                                    isHub
                                                    isPreview
                                                />
                                            },
                                            {
                                                path: '/add/offer',
                                                title: 'Add Offer',
                                                component: ({ close, back }) => <FormPost
                                                    add
                                                    type="OFFER"
                                                    close={close}
                                                    back={back}
                                                    isTitle
                                                    isSubtitle
                                                    isDescription
                                                    isContent
                                                    isHub
                                                    isPreview
                                                />
                                            }
                                        ])
                                    }
                                }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            )}
                        </Query>
                        
                        <Query query={GET_USER_POSTS} pseudo={{ height: 256, count: 3 }}>
                            {({ data, refetch }) =>
                                <Subscription query={SUB_USER_POSTS} refetch={refetch}>
                                    {({ subData }) => {
                                        const posts = ((subData && subData.posts) || data.allUserPosts)
                                        const currentHub = state.filters.currentHub

                                        if (posts.length === 0)
                                            return <Message text="Empty" padding />

                                        return (
                                            <div className="grid">
                                                {posts.map((post, key) => ((currentHub === 'all') || (post.hub.id === currentHub)) ? (
                                                    <Entry key={key} options={{
                                                        editable: true,
                                                        capacious: false,
                                                        manageOffset: !(post.preview && !post.preview.path),
                                                        statusBar: {
                                                            options: (post.type === 'ARTICLE') ? [
                                                                { lite: 'Comments', dark: post.comments.length || 0 },
                                                                { lite: 'Views', dark: post.views || 0 },
                                                                {
                                                                    lite: <Moment locale="ru" date={new Date(new Date().setTime(post.createdAt))} format="MMMM, DD" />,
                                                                    dark: <Moment locale="ru" date={new Date(new Date().setTime(post.createdAt))} format="LT" />
                                                                }
                                                            ] : [
                                                                {
                                                                    lite: <Moment locale="ru" date={new Date(new Date().setTime(post.createdAt))} format="MMMM, DD" />,
                                                                    dark: <Moment locale="ru" date={new Date(new Date().setTime(post.createdAt))} format="LT" />
                                                                },
                                                                { lite: 'Views', dark: post.views || 0 }
                                                            ]
                                                        },
                                                        handlerView: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: 'Post',
                                                                component: ({ close }) => <ViewPost document={post} close={close} />
                                                            }
                                                        ]),
                                                        handlerEdit: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: 'Edit Post',
                                                                component: ({ close }) => <FormPost document={post} close={close} edit />
                                                            }
                                                        ]),
                                                        handlerDelete: () => showModal([
                                                            {
                                                                path: '/',
                                                                title: 'Delete Post',
                                                                component: ({ close }) => <DeleteEntries
                                                                    entry={post}
                                                                    query={DELETE_POSTS}
                                                                    handler={async (action, entry, docs) => {
                                                                        await action({
                                                                            variables: {
                                                                                posts: (entry)
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
                                                        {(post.preview && post.preview.path) && <img
                                                                className="image"
                                                                src={(post.preview.path).replace('./', `${api}/`)}
                                                                alt="Preview"
                                                            />
                                                        }
                                                        <div className="tags">
                                                            <p className="tag type">{post.type}</p>
                                                            {(post.hub) && <p className="tag" style={{ background: post.hub.color }}>{post.hub.title}</p>}
                                                        </div>
                                                        {(post.title) && <h2 className="title">{post.title}</h2>}
                                                        {/*(post.subtitle) && <p className="subtitle">{post.subtitle}</p>*/}
                                                        {(post.description) && <p className="paragraph">{post.description}</p>}
                                                        {(post.content) && <p className="body">{post.content}</p>}
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
        </Row>
    )
}

export default ({ showModal }) => {
    return (
        <main className="profile">
            <aside className="head">
                <Head />
            </aside>

            <aside className="body">
                <HubToggler />
                <Content showModal={showModal} />
            </aside>
        </main>
    )
}