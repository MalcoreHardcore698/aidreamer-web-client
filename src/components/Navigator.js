import React from 'react'
import Row from './ui/Row'
import Container from './ui/Container'
import Headline from './ui/Headline'
import Toggler from './ui/Toggler'
import Section from './ui/Section'
import Message from './ui/Message'
import Button from './ui/Button'
import Search from './ui/Search'
import Entry from './ui/Entry'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import targets from '../stores/targets'
import hubs from '../stores/hubs'
import offers from '../stores/offers'
import ImageAvatar from '../assets/images/avatar.png'

const OfferContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal }) => {
    return (
        <main className="navigator">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Navigator</span>
                        <span>Search</span>
                    </Headline>

                    <Button options={{
                        type: 'icon',
                        state: 'inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                {offers.map((offer, key) =>
                    <Entry key={key} options={{
                        capacious: false,
                        userBar: {
                            name: 'noctua',
                            status: 'online',
                            avatar: ImageAvatar
                        },
                        statusBar: [
                            { lite: 'May, 16', dark: '14:15 AM' }
                        ],
                        handler: () => showModal([
                            {
                                path: '/',
                                title: 'Offer',
                                component: () => <OfferContent />
                            }
                        ])
                    }}>
                        <h2 className="title">{offer.title}</h2>
                    </Entry>
                )}
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
                    name: 'offers',
                    title: 'Offers',
                    subtitle: offers.length,
                    targets
                }}>
                    {offers.concat(offers, offers, offers).map((offer, key) =>
                        <Entry key={key} options={{
                            capacious: false,
                            userBar: {
                                name: 'noctua',
                                status: 'online',
                                avatar: ImageAvatar
                            },
                            statusBar: [
                                { lite: 'May, 16', dark: '14:15 AM' }
                            ],
                            handler: () => showModal([
                                {
                                    path: '/',
                                    title: 'Offer',
                                    component: () => <OfferContent />
                                }
                            ])
                        }}>
                            <h2 className="title">{offer.title}</h2>
                        </Entry>
                    )}
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'invites',
                    title: 'Invites',
                    subtitle: 12,
                    manage: false
                }}>
                    
                </Section>
            </aside>
        </main>
    )
}