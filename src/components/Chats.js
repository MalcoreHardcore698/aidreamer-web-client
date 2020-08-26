import React from 'react'
import Row from './ui/Row'
import Headline from './ui/Headline'
import Section from './ui/Section'
import Button from './ui/Button'
import Search from './ui/Search'
import List from './ui/List'
import Unit from './ui/Unit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import members from '../stores/members'
import units from '../stores/units'

export default () => {
    return (
        <main className="chats">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Chats</span>
                        <span>Messages</span>
                    </Headline>

                    <Button options={{
                        type: 'icon',
                        state: 'inactive'
                    }}>
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </Row>

                <Search />

                {units.map((unit, key) =>
                    <Unit key={key} options={{ unit }} />
                )}
            </aside>

            <aside>
                <Section options={{
                    name: 'chats',
                    title: 'Chat',
                    subtitle: 'Fortnite',
                    manage: false
                }}>
                    
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'team-ranking',
                    title: 'Members',
                    subtitle: '12,457',
                    manage: false
                }}>
                    <List options={{ list: members }}>
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
            </aside>
        </main>
    )
}