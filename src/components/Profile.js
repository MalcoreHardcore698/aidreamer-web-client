import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from './ui/Row'
import Container from './ui/Container'
import Headline from './ui/Headline'
import Message from './ui/Message'
import Achievement from './ui/Achievement'
import Toggler from './ui/Toggler'
import Section from './ui/Section'
import Notify from './ui/Notify'
import Entry from './ui/Entry'
import targets from '../stores/targets'
import hubs from '../stores/hubs'
import offers from '../stores/offers'
import articles from '../stores/articles'
import tours from '../stores/tours'
import achievements from '../stores/achievements'
import notifications from '../stores/notifications'
import ImageArticle from '../assets/images/article.png'
import ImageTourPoster from '../assets/images/poster.png'

const EntryContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal }) => {
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
                    {articles.map((article, key) =>
                        <Entry key={key} options={{
                            editable: true,
                            capacious: false,
                            manageOffset: true,
                            statusBar: [
                                { lite: 'Comments', dark: '47' },
                                { lite: 'Views', dark: '13,541' },
                                { lite: 'May, 16', dark: '14:15 AM' }
                            ],
                            handlerEdit: () => showModal([
                                {
                                    path: '/',
                                    title: 'Edit Article',
                                    component: () => <EntryContent />
                                }
                            ]),
                            handlerDelete: () => showModal([
                                {
                                    path: '/',
                                    title: 'Edit Article',
                                    component: () => <EntryContent />
                                }
                            ])
                        }}>
                            <img className="image" src={ImageArticle} alt="Article" />
                            <h2 className="title">Need a teammate</h2>
                            <p className="paragraph">Some text for opinion</p>
                        </Entry>
                    )}
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