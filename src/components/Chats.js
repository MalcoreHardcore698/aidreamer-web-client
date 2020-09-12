import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment'

import Mutation from './ui/Mutation'
import Query from './ui/Query'
import Subscription from './ui/Subscription'
import Row from './ui/Row'
import Headline from './ui/Headline'
import Section from './ui/Section'
import Search from './ui/Search'
import List from './ui/List'
import Unit from './ui/Unit'
import Avatar from './ui/Avatar'
import Input from './ui/Input'
import Message from './ui/Message'
import ViewAlert from './content/ViewAlert'
import {
    ADD_USER_CHAT_MESSAGE,
    GET_CHAT_MESSAGES,
    GET_USER_CHATS,
    SUB_USER_CHATS,
    SUB_MESSAGES
} from '../utils/queries'
import { setChat } from '../utils/actions'

function getShortText(messages) {
    if (messages.length === 0) return ''

    const text = messages[messages.length - 1].text
    const length = text.length
    if (length > 14)
        return `${text.slice(0, 15)}...`
    else return text
}

const Chat = ({ messages, showModal }) => {
    const state = useSelector(state => state)

    return (
        <div className="ui-chat">
            <div className="messages">
                {(messages.length === 0) ? <Message text="Empty History" padding />
                : messages.map((message, key) => (message) ?
                    <div key={key} className="message">
                        <Avatar avatar={{ path: message.user.avatar.path }} properties={['circle']} />
                        <div className={`content ${(message.user.name === state.user.name) ? 'dark' : 'lite'}`}>
                            <p className="text">{message.text}</p>
                            <p className="date">
                                <Moment date={new Date(new Date().setTime(message.createdAt))} format="h:m" />
                            </p>
                        </div>
                    </div> : null
                )}
            </div>

            <Row type="flex">
                <Avatar avatar={{ path: state.user.avatar.path }} properties={['circle']} />
                <Mutation query={ADD_USER_CHAT_MESSAGE}>
                    {({ action }) => (
                        <Input options={{
                            onKeyPress: async (e) => {
                                try {
                                    if (e.key === 'Enter') {
                                        if (state.chat && state.chat.chat) {
                                            e.persist()
                                            
                                            const text = e.target.value
                                            e.target.value = ''

                                            await action({
                                                variables: {
                                                    id: state.chat.chat.id,
                                                    text: text
                                                }
                                            })
                                        }
                                    }
                                } catch {
                                    showModal([
                                        {
                                            path: '/',
                                            title: 'Error',
                                            component: ({ close }) => <ViewAlert
                                                text="Ops! Wrong something :("
                                                close={close}
                                            />
                                        }
                                    ], true)
                                }
                            }
                        }} />
                    )}
                </Mutation>
            </Row>
        </div>
    )
}

export default ({ showModal }) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <main className="chats">
            <aside>
                <Row type="flex sb">
                    <Headline>
                        <span>Chats</span>
                        <span>Messages</span>
                    </Headline>
                </Row>

                <Search />

                <Query query={GET_USER_CHATS} pseudo={{ height: 64, count: 6 }}>
                    {({ data, refetch }) =>
                        <Subscription query={SUB_USER_CHATS} refetch={refetch}>
                            {({ subData }) => {
                                const chats = (subData && subData.userChats) || (data && data.allUserChats) || []

                                if (chats.length === 0)
                                    return <Message text="No Chats" padding/>

                                return (
                                    chats.map((unit, key) =>
                                        <Unit key={key} options={{
                                            unit: {
                                                id: unit.id,
                                                name: unit?.interlocutor?.name || 'Undefined',
                                                legend: getShortText(unit?.chat?.messages),
                                                count: unit?.chat?.messages.filter(m => m?.type === 'UNREADED')?.length || null,
                                                img: unit?.chat?.interlocutor?.avatar
                                            },
                                            active: state.chat,
                                            handler: () => dispatch(setChat(unit))
                                        }} />
                                    )
                                )
                            }}
                        </Subscription>
                    }
                </Query>
            </aside>

            <aside>
                <Section options={{
                    name: 'chats',
                    title: 'History',
                    subtitle: (state.chat) && (state.chat.interlocutor.name),
                    manage: false
                }}>
                    {() => (
                        (!state.chat)
                        ? <Message text="Please select a chat to start messaging" padding />
                        : (
                            <Query query={GET_CHAT_MESSAGES} variables={{ id: state.chat.chat.id }} pseudo={{ count: 1 }}>
                                {({ data, refetch }) =>
                                    <Subscription query={SUB_MESSAGES} variables={{ id: state.chat.chat.id }} refetch={refetch}>
                                        {({ subData }) => {
                                            console.log(subData, data)
                                            const messages = (subData && subData.messages) || (data && data.allChatMessages) || (state.chat.chat.messages) || []

                                            return (
                                                <Chat
                                                    messages={messages}
                                                    showModal={showModal}
                                                />
                                            )
                                        }}
                                    </Subscription>
                                }
                            </Query>
                        )
                    )}
                </Section>
            </aside>

            <aside>
                {(state.chat && state.chat.members) && <Section options={{
                    name: 'members',
                    title: 'Members',
                    subtitle: (state.chat && state.chat.members) ? state.chat.members.length : 0,
                    manage: false
                }}>
                    {() => (
                        (state.chat && state.chat.members) ?
                        <List options={{ list: state.chat.members }}>
                            {({ item }) => (
                                <React.Fragment>
                                    <Avatar avatar={{ path: item.avatar.path }} properties={['circle']} />
                                    <p className="name">{item.name}</p>
                                </React.Fragment>
                            )}
                        </List> : <Message text="No Members" padding />
                    )}
                </Section>}
            </aside>
        </main>
    )
}