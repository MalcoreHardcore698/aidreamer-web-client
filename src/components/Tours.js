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
import tours from '../stores/tours'
import matches from '../stores/matches'
import ImageTourPoster from '../assets/images/poster.png'

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

const Match = () => {
    return (
        <div className="ui-match">
            <p>Match</p>
        </div>
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
                    <Match key={key} options={{
                        match, handler: () => showModal([
                            {
                                path: '/',
                                title: 'Match',
                                component: () => <MatchContent />
                            }
                        ])
                    }} />
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
                    manage: false
                }}>
                    
                </Section>

                <Section options={{
                    name: 'player-ranking',
                    title: 'Player Ranking',
                    manage: false
                }}>
                    
                </Section>

                <Section options={{
                    name: 'teams',
                    title: 'Teams',
                    manage: false
                }}>
                    <Search filter />

                    <Message text="No Content" padding />
                </Section>
            </aside>
        </main>
    )
}