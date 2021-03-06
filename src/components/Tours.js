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
import List from './ui/List'
import Unit from './ui/Unit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import {
    GET_ALL_HUBS,
    SUB_ALL_HUBS
} from '../utils/queries'
import targets from '../stores/targets'
import tours from '../stores/tours'
import matches from '../stores/matches'
import members from '../stores/members'

import ImageTeamAstralis from '../assets/images/astralis.png'
import ImageTeamVirtus from '../assets/images/virtus.png'
import ImageTeamSpirit from '../assets/images/spirit.png'
import ImageTourPoster from '../assets/images/poster.png'
import { config } from '../utils/config'

const api = config.get('api')

const MatchContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

const TourContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal }) => {
    return (
        <main className="tours">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Tours</span>
                        <span>Matches</span>
                    </Headline>

                    <Button options={{
                        type: 'icon',
                        state: 'inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                {matches.map((match, key) =>
                    <List key={key} options={{
                        list: match.participants,
                        handlerList: () => showModal([
                            {
                                path: '/',
                                title: 'Match',
                                component: () => <MatchContent />
                            }
                        ])
                    }}>
                        {({ item }) => (
                            <React.Fragment>
                                <p className="avatar">
                                    <img src={item.avatar} alt="User" />
                                </p>
                                <p className="name">{item.name}</p>
                                <p className="score">{item.score}</p>
                            </React.Fragment>
                        )}
                    </List>
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
                    name: 'tours',
                    title: 'Tours',
                    subtitle: tours.length,
                    targets
                }}>
                    {tours.map((tour, key) =>
                        <Entry key={key} options={{
                            capacious: false,
                            statusBar: [
                                { lite: 'Participants', dark: tour.participants },
                                { lite: 'Date', dark: tour.date },
                                { lite: 'Prize Pool', dark: tour.prize },
                                { lite: 'Location', dark: tour.location }
                            ],
                            handler: () => showModal([
                                {
                                    path: '/',
                                    title: 'Tour',
                                    component: () => <TourContent />
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
                    name: 'team-ranking',
                    title: 'Team Ranking',
                    subtitle: 3,
                    manage: false
                }}>
                    <List options={{
                        list: [
                            { image: ImageTeamAstralis, name: 'Cloud9' },
                            { image: ImageTeamVirtus, name: 'Vurtus.pro' },
                            { image: ImageTeamSpirit, name: 'Spirit' }
                        ],
                        handler: () => showModal([
                            {
                                path: '/',
                                title: 'Team Profile',
                                component: () => <MatchContent />
                            }
                        ])
                    }}>
                        {({ item }) => (
                            <React.Fragment>
                                <p className="avatar">
                                    <img src={item.image} alt="User" />
                                </p>
                                <p className="name">{item.name}</p>
                            </React.Fragment>
                        )}
                    </List>
                </Section>

                <Section options={{
                    name: 'player-ranking',
                    title: 'Player Ranking',
                    subtitle: 5,
                    manage: false
                }}>
                    <List options={{
                        list: members,
                        handler: () => showModal([
                            {
                                path: '/',
                                title: 'Player Profile',
                                component: () => <MatchContent />
                            }
                        ])
                    }}>
                        {({ item }) => (
                            <React.Fragment>
                                <p className="avatar">
                                    <img src={item.avatar} alt="User" />
                                </p>
                                <p className="name">{item.name}</p>
                            </React.Fragment>
                        )}
                    </List>
                </Section>

                <Section options={{
                    name: 'teams',
                    title: 'Teams',
                    manage: false
                }}>
                    <Search filter />

                    {[
                        { img: ImageTeamAstralis, name: 'Cloud9', legend: '73 wins' },
                        { img: ImageTeamVirtus, name: 'Vurtus.pro', legend: '45 wins' },
                        { img: ImageTeamSpirit, name: 'Spirit', legend: '13 wins' }
                    ].map((unit, key) => <Unit key={key} options={{
                        unit,
                        handler: () => showModal([
                            {
                                path: '/',
                                title: 'Team Profile',
                                component: () => <MatchContent />
                            }
                        ])
                    }} />)}
                </Section>
            </aside>
        </main>
    )
}