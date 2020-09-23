import React from 'react'
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
import HubToggler from './ui/HubToggler'
import Button from './ui/Button'
import Section from './ui/Section'
import Entry from './ui/Entry'
import ViewArticle from './content/ViewArticle'
import AddArticle from './content/AddArticle'
import EditArticle from './content/EditArticle'
import DeleteEntries from './content/DeleteEntries'
import {
    GET_USER_ACTS,
    GET_USER_ARTICLES,
    DELETE_ARTICLES,
    SUB_USER_ACTS,
    SUB_USER_ARTICLES
} from '../utils/queries'
import SVGExpIcon from '../assets/images/exp-icon.svg'
import SVGGemIcon from '../assets/images/gem-icon.svg'
import targets from '../stores/targets'
import { config } from '../utils/config'
import _ from 'lodash'
import CounterBadge from './ui/CounterBadge'

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
                <HubToggler all />

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
                </Row>
            </aside>
        </main>
    )
}