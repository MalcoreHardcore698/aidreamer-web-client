import React from 'react'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
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
import {
    GET_ALL_HUBS,
    SUB_ALL_HUBS
} from '../utils/queries'
import targets from '../stores/targets'
import offers from '../stores/offers'
import ImageAvatar from '../assets/images/avatar.png'
import { config } from '../utils/config'

const api = config.get('api')

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
                        editable: true,
                        capacious: false,
                        statusBar: [
                            { lite: 'May, 16', dark: '14:15 AM' }
                        ],
                        handlerEdit: () => showModal([
                            {
                                path: '/',
                                title: 'Edit Offer',
                                component: () => <OfferContent />
                            }
                        ]),
                        handlerDelete: () => showModal([
                            {
                                path: '/',
                                title: 'Delete Offer',
                                component: () => <OfferContent />
                            }
                        ])
                    }}>
                        <h2 className="title">{offer.title}</h2>
                    </Entry>
                )}
            </aside>

            <aside>
                <Query query={GET_ALL_HUBS} variables={{ status: 'PUBLISHED' }}>
                    {({ data, refetch }) => (data.allHubs.length > 1) && (
                        <Subscription query={SUB_ALL_HUBS} variables={{ status: 'PUBLISHED' }} refetch={refetch}>
                            {({ subData }) => (
                                <Toggler options={{
                                    type: 'auto',
                                    targets: ((subData && subData.hubs) || data.allHubs).map((hub, key) => ({
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
                                    }}
                                />
                            )}
                        </Subscription>
                    )}
                </Query>

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