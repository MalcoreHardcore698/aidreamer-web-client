import React from 'react'
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

import AddArticle from './content/AddArticle'
import EditArticle from './content/EditArticle'
import DeleteEntry from './content/DeleteEntry'

import {
    GET_USER_ARTICLES,
    DELETE_ARTICLE,
    SUB_USER_ARTICLES
} from '../utils/queries'

import targets from '../stores/targets'
import hubs from '../stores/hubs'
import offers from '../stores/offers'
import articles from '../stores/articles'
import tours from '../stores/tours'
import achievements from '../stores/achievements'
import notifications from '../stores/notifications'

import ImageTourPoster from '../assets/images/poster.png'
import { config } from '../utils/config'

const api = config.get('api')

const EntryContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal, hideModal }) => {
    const state = useSelector(state => state)

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
                    {achievements.map((achievement, key) =>
                        <Achievement key={key} options={{
                            achievement,
                            handler: () => showModal([
                                {
                                    path: '/',
                                    title: 'Achievement',
                                    component: () => <EntryContent />
                                }
                            ])
                        }} />    
                    )}
                </Section>
            </aside>

            <aside>
                <Toggler options={{ type: 'auto', targets: hubs.map((hub, key) => ({
                    type: hub.type,
                    value: <Row key={key}>
                                <div className="icon">
                                    <FontAwesomeIcon icon={hub.icon} />
                                </div>
                                <p>{hub.title}</p>
                            </Row>
                        }))
                    }}
                />
                <Section options={{
                    name: 'my-offers',
                    title: 'My Offers',
                    subtitle: offers.length,
                    targets
                }}>
                    {offers.map((offer, key) =>
                        <Entry key={key} options={{
                            editable: true,
                            capacious: false,
                            statusBar: [
                                { lite: 'May, 16', dark: '14:15 AM' }
                            ],
                            handlerEdit: () => showModal([
                                {
                                    path: '/',
                                    title: 'Edit Offer',
                                    component: () => <EntryContent />
                                }
                            ]),
                            handlerDelete: () => showModal([
                                {
                                    path: '/',
                                    title: 'Delete Offer',
                                    component: () => <EntryContent />
                                }
                            ])
                        }}>
                            <h2 className="title">{offer.title}</h2>
                        </Entry>
                    )}
                </Section>

                <Section options={{
                    name: 'my-articles',
                    title: 'My Articles',
                    subtitle: articles.length,
                    targets
                }}>
                    <Button options={{
                        type: 'inactive',
                        handler: () => {
                            showModal([
                                {
                                    path: '/',
                                    title: 'Add Article',
                                    component: ({ jump }) => <AddArticle jump={jump} hideModal={hideModal} />
                                }
                            ])
                        }
                    }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Query query={GET_USER_ARTICLES} variables={{ id: state.user.id }}>
                        {({ data, refetch }) =>
                            <Subscription query={SUB_USER_ARTICLES} variables={{ id: state.user.id }} refetch={refetch}>
                                {({ subData }) => ((subData && subData.articles) || data.allUserNews).map((news, key) =>
                                    <Entry key={key} options={{
                                        editable: true,
                                        capacious: false,
                                        manageOffset: true,
                                        statusBar: [
                                            { lite: 'Comments', dark: news.comments.length || 0 },
                                            { lite: 'Views', dark: news.views || 0 },
                                            {
                                                lite: <Moment date={new Date(new Date().setTime(news.createdAt))} format="MMM, DD" />,
                                                dark: <Moment date={new Date(new Date().setTime(news.createdAt))} format="h:m" />
                                            }
                                        ],
                                        handlerEdit: () => showModal([
                                            {
                                                path: '/',
                                                title: 'Edit Article',
                                                component: () => <EditArticle news={news} hideModal={hideModal} />
                                            }
                                        ]),
                                        handlerDelete: () => showModal([
                                            {
                                                path: '/',
                                                title: 'Delete Article',
                                                component: () => <DeleteEntry entry={news} query={DELETE_ARTICLE} hideModal={hideModal} />
                                            }
                                        ])
                                    }}>
                                        <img className="image" src={(news.image.path).replace('./', `${api}/`)} alt="Article" />
                                        <h2 className="title">{news.title}</h2>
                                        <p className="paragraph">{news.description}</p>
                                    </Entry>
                                )}
                            </Subscription>
                        }
                    </Query>
                </Section>

                <Section options={{
                    name: 'my-tours',
                    title: 'My Tours',
                    subtitle: tours.length,
                    targets
                }}>
                    {tours.map((tour, key) =>
                        <Entry key={key} options={{
                            editable: true,
                            capacious: false,
                            manageOffset: true,
                            statusBar: [
                                { lite: 'Participants', dark: tour.participants },
                                { lite: 'Date', dark: tour.date },
                                { lite: 'Prize Pool', dark: tour.prize },
                                { lite: 'Location', dark: tour.location }
                            ],
                            handlerEdit: () => showModal([
                                {
                                    path: '/',
                                    title: 'Edit Tour',
                                    component: () => <EntryContent />
                                }
                            ]),
                            handlerDelete: () => showModal([
                                {
                                    path: '/',
                                    title: 'Delete Tour',
                                    component: () => <EntryContent />
                                }
                            ])
                        }}>
                            <img className="image" src={ImageTourPoster} alt="Tour" />
                            <h2 className="title separeted">
                                <span>{tour.title}</span><span>{tour.type}</span>
                            </h2>
                        </Entry>
                    )}
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'notifications',
                    title: 'Notification',
                    subtitle: notifications.length,
                    manage: false
                }}>
                    {notifications.map((notification, key) =>
                        <Notify key={key} options={{
                            message: notification.msg,
                            avatar: notification.img
                        }} />    
                    )}
                </Section>
            </aside>
        </main>
    )
}