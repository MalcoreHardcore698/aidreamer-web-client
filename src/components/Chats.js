import React, { useState } from 'react'
import Row from './ui/Row'
import Headline from './ui/Headline'
import Section from './ui/Section'
import Button from './ui/Button'
import Search from './ui/Search'
import List from './ui/List'
import Unit from './ui/Unit'
import Avatar from './ui/Avatar'
import Input from './ui/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import units from '../stores/units'
import Message from './ui/Message'
import ImageAvatar from '../assets/images/avatar.png'

const Chat = ({ chat }) => {
    return (
        <div className="ui-chat">
            <div className="messages">
                {(chat || chat?.messages.length > 0) ?
                    chat.messages.map((message, key) =>
                        <div key={key} className="message">
                            <img src={message.avatar} alt={message.name} />
                            <p className="name">{message.name}</p>
                            <p className="date">{message.date}</p>
                        </div>
                    ) : <Message
                        text="No Messages"
                    />
                }
            </div>

            <form>
                <Row type="flex">
                    <Avatar avatar={{ path: ImageAvatar }} properties={['circle']} />
                    <Input options={{

                    }} />
                </Row>
            </form>
        </div>
    )
}

export default () => {
    const [chat, setChat] = useState(null)

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
                    <Unit key={key} options={{
                        unit,
                        handler: () => setChat(unit)
                    }} />
                )}
            </aside>

            <aside>
                <Section options={{
                    name: 'chats',
                    title: 'Chat',
                    subtitle: (chat) && chat.name,
                    manage: false
                }}>
                    {(chat) ?
                        <Chat options={{
                            chat
                        }} /> :
                        <Message text="Please select a chat to start messaging" padding />
                    }
                </Section>
            </aside>

            <aside>
                <Section options={{
                    name: 'team-ranking',
                    title: 'Members',
                    subtitle: (chat && chat.members) ? chat.members.length : 0,
                    manage: false
                }}>
                    {(chat && chat.members) ?
                        <List options={{ list: chat.members }}>
                            {({ item }) => (
                                <React.Fragment>
                                    <p className="avatar">
                                        <img src={item.avatar} alt="User" />
                                    </p>
                                    <p className="name">{item.name}</p>
                                </React.Fragment>
                            )}
                        </List> : <Message text="No Members" padding />
                    }
                </Section>
            </aside>
        </main>
    )
}