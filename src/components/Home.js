import React from 'react'
import Row from './ui/Row'
import Container from './ui/Container'
import Message from './ui/Message'
import Headline from './ui/Headline'
import Button from './ui/Button'
import Search from './ui/Search'
import Toggler from './ui/Toggler'
import Section from './ui/Section'
import Entry from './ui/Entry'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import targets from '../stores/targets'
import hubs from '../stores/hubs'
import news from '../stores/articles'
import ImageAvatar from '../assets/images/avatar.png'
import ImageArticle from '../assets/images/article.png'

const EntryContent = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

export default ({ showModal }) => {
    return (
        <main className="home">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Aid</span>
                        <span>Reamer</span>
                    </Headline>

                    <Button options={{
                        type: 'icon',
                        state: 'inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                {news.map((newsOne, key) =>
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
                    name: 'news',
                    title: 'News',
                    subtitle: news.length,
                    targets
                }}>
                    {news.concat(news).map((newsOne, key) =>
                        <Entry key={key} options={{
                            capacious: false,
                            userBar: {
                                name: newsOne.author,
                                status: 'online',
                                avatar: ImageAvatar
                            },
                            statusBar: [
                                { lite: 'Comments', dark: '47' },
                                { lite: 'Views', dark: '13,541' },
                                { lite: 'May, 16', dark: '14:15 AM' }
                            ],
                            handler: () => showModal([
                                {
                                    path: '/',
                                    title: 'Article',
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
            </aside>
        </main>
    )
}