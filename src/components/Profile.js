import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbarWithChildren, buildStyles  } from 'react-circular-progressbar'
import Moment from 'react-moment'
import Row from './ui/Row'
import Container from './ui/Container'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Avatar from './ui/Avatar'
import Frame from './ui/Frame'
import Headline from './ui/Headline'
import Message from './ui/Message'
import Act from './ui/Act'
import Dropdown from './ui/Dropdown'
import List from './ui/List'
import Button from './ui/Button'
import Section from './ui/Section'
import Entry from './ui/Entry'
import CounterBadge from './ui/CounterBadge'
import ViewPost from './views/Post'
import FormPost from './forms/Post'
import DeleteEntries from './forms/Delete'
import {
    GET_USER_ACTS,
    GET_USER_POSTS,
    DELETE_POSTS,
    SUB_USER_ACTS,
    SUB_USER_POSTS,
    GET_ALL_POST_TYPES
} from '../utils/queries'
import SVGExpIcon from '../assets/images/exp-icon.svg'
import SVGGemIcon from '../assets/images/gem-icon.svg'
import targets from '../stores/targets'
import { config } from '../utils/config'
import _ from 'lodash'

const api = config.get('api')

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


export default ({ showModal }) => {
    const state = useSelector(state => state)

    const [postDropdown, setPostDropdown] = useState(false)
    const [postDropdownLeft, setPostDropdownLeft] = useState(0)

    if (!state.user) return null

    return (
        <main className="profile">
            <aside className="head">
                <Row>
                    <div className="circle">
                        <Avatar avatar={{ path: state.user.avatar.path }} properties={['circle']} />
                        
                        <div className="exp">
                            <CircularProgressbarWithChildren
                                value={15}
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
                            count: state.user.level || 1
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

                        <Row type="flex">
                            <div className="user-overview">
                                <div className="user-overview-stat">
                                    <p className="value">21</p>
                                    <p className="legend">Offers</p>
                                </div>
                                <div className="user-overview-stat">
                                    <p className="value">14</p>
                                    <p className="legend">Articles</p>
                                </div>
                                <div className="user-overview-stat">
                                    <p className="value">2</p>
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
                    </div>
                </Row>
            </aside>

            <aside className="body">
                {/* <HubToggler all /> */}

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
                                <Button options={{
                                    state: 'inactive',
                                    classNames: 'stretch',
                                    handler: (e) => {
                                        setPostDropdown(!postDropdown)
                                        console.log(document.body.offsetWidth, e.target.offsetWidth, e.pageX)
                                        setPostDropdownLeft(document.body.offsetWidth - e.target.offsetWidth - e.pageX)
                                    }
                                }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>

                                <Query query={GET_ALL_POST_TYPES} pseudo={{ height: 40, count: 1 }}>
                                    {({ data }) => (
                                        <Dropdown options={{
                                            dropdown:
                                            postDropdown,
                                            styles: {
                                                left: -postDropdownLeft,
                                                right: 'auto',
                                                marginLeft: -50
                                            }
                                        }}>
                                            <List options={{
                                                list: data.allPostTypes.map(postType => ({ id: postType, label: postType})),
                                                handlerItem: (item) => {
                                                    showModal([
                                                        {
                                                            path: '/',
                                                            title: 'Add Post',
                                                            component: ({ close }) => <FormPost
                                                                add
                                                                type={item.id}
                                                                close={close}
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
                                                {({ item }) => (
                                                    <div className="name">{item.label}</div>
                                                )}
                                            </List>
                                        </Dropdown>
                                    )}
                                </Query>
                                
                                <Query query={GET_USER_POSTS} pseudo={{ height: 256, count: 3 }}>
                                    {({ data, refetch }) =>
                                        <Subscription query={SUB_USER_POSTS} refetch={refetch}>
                                            {({ subData }) => {
                                                const posts = ((subData && subData.posts) || data.allUserPosts)

                                                if (posts.length === 0)
                                                    return <Message text="Empty" padding />

                                                return (
                                                    <div className="grid">
                                                        {posts.map((post, key) => ((state.filters.currentHub === 'all') || (post.hub.id === state.filters.currentHub.id)) ? (
                                                            <Entry key={key} options={{
                                                                editable: true,
                                                                capacious: false,
                                                                manageOffset: !(post.preview && !post.preview.path),
                                                                statusBar: {
                                                                    options: [
                                                                        { lite: 'Comments', dark: post.comments.length || 0 },
                                                                        { lite: 'Views', dark: post.views || 0 },
                                                                        {
                                                                            lite: <Moment date={new Date(new Date().setTime(post.createdAt))} format="MMM, DD" />,
                                                                            dark: <Moment date={new Date(new Date().setTime(post.createdAt))} format="h:m" />
                                                                        }
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
                                                                        alt="Article"
                                                                    />
                                                                }
                                                                <p className="tag" style={{ background: post.hub?.color }}>{post.hub?.title}</p>
                                                                <h2 className="title">{post.title}</h2>
                                                                <p className="paragraph">{post.description}</p>
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
            </aside>
        </main>
    )
}