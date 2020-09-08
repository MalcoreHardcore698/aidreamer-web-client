import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Moment from 'react-moment'
import Mutation from '../ui/Mutation'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import Input from '../ui/Input'
import Button from '../ui/Button'
import List from '../ui/List'
import Message from '../ui/Message'
import Entry from '../ui/Entry'
import { config } from '../../utils/config'
import { ADD_COMMENT } from '../../utils/queries'

const api = config.get('api')

export default ({ article }) => {
    const state = useSelector(state => state)
    const [comments, setComments] = useState(false)

    return (
        <Container type="fat">
            <Entry options={{
                capacious: false,
                statusBar: {
                    options: [
                        { lite: 'Comments', dark: article.comments.length || 0 },
                        { lite: 'Views', dark: article.views || 0 },
                        {
                            lite: <Moment date={new Date(new Date().setTime(article.createdAt))} format="MMM, DD" />,
                            dark: <Moment date={new Date(new Date().setTime(article.createdAt))} format="h:m" />
                        }
                    ],
                    input: (
                        <React.Fragment>
                            <Avatar avatar={{ path: state.user.avatar.path }} properties={['circle']} />
                            <Mutation query={ADD_COMMENT}>
                                {({ action }) => (
                                    <Input options={{
                                        onKeyPress: async (e) => {
                                            try {
                                                if (e.key === 'Enter') {
                                                    e.persist()
                                                    
                                                    const text = e.target.value
                                                    e.target.value = ''
        
                                                    await action({
                                                        variables: {
                                                            article: article.id,
                                                            text
                                                        }
                                                    })
                                                }
                                            } catch {
                                                console.error('Server Error')
                                            }
                                        }
                                    }} />
                                )}
                            </Mutation>
                        </React.Fragment>
                    )
                }
            }}>
                {(article.image && article.image.path) && <img
                        className="image large"
                        src={(article.image.path).replace('./', `${api}/`)}
                        alt="Article"
                    />
                }
                <p className="paragraph">{article.description}</p>
                <p className="body">{article.body}</p>
                <p className="hub">Hub: {article.hub.title}</p>
            </Entry>

            {(!comments && article.comments.length > 0) && (
                <Button options={{
                    state: 'inactive',
                    handler: () => setComments(!comments)
                }}>
                    <p>Show Comments</p>
                </Button>
            )}

            {(comments) ? (
                (article.comments.length > 0) ?
                <List options={{ list: article.comments }}>
                    {({ item }) => (
                        <React.Fragment>
                            <p className="avatar">
                                <img src={item.user.avatar.path} alt="User" />
                            </p>
                            <p className="name">{item.text}</p>
                            <p className="date">
                                <Moment date={new Date(new Date().setTime(item.createdAt))} format="h:m" />
                            </p>
                        </React.Fragment>
                    )}
                </List> :
                <Message text="No Comments" padding />
            ) : null}
        </Container>
    )
}