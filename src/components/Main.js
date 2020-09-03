import React, { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCompass,
    faPaperPlane,
    // eslint-disable-next-line 
    faTrophy,
    faPen,
    faLock,
    faFlag,
    faQuestion,
    faBell,
    faCog
} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthContext'
import Row from './ui/Row'
import Navigation from './ui/Navigation'
import Container from './ui/Container'
import Message from './ui/Message'
import Button from './ui/Button'
import Modal from './ui/Modal'
import List from './ui/List'
import Input from './ui/Input'
import TextArea from './ui/TextArea'
import Divider from './ui/Divider'
import Skeleton from './ui/Skeleton'
import Auth from '../components/Auth'
import { setUser } from '../utils/actions'
import { GET_USER } from '../utils/queries'

import ImageAvatar from '../assets/images/avatar.png'
import SVGLogo from '../assets/images/logo'

import routes from '../routes'
import '../assets/styles/App.css'
    
function getButton(handler, routes, icon) {
    return ({
        options: {
            type: 'large-round',
            handler: () => handler(routes)
        },
        component: <FontAwesomeIcon icon={icon} />
    })
}

const links = [
    {
        path: '/profile',
        component: <img src={ImageAvatar} alt="Avatar" />
    },
    {
        path: '/',
        component: SVGLogo
    },
    {
        path: '/navigator',
        component: <FontAwesomeIcon icon={faCompass} />
    },
    /*
    {
        path: '/tours',
        component: <FontAwesomeIcon icon={faTrophy} />
    },
    */
    {
        path: '/chats',
        component: <FontAwesomeIcon icon={faPaperPlane} />
    }
]

const InfoImage = () => {
    return (
        <Container>
            <Message text="No Content" padding />
        </Container>
    )
}

const SettingsEditProfileContent = ({ jump }) => {
    const state = useSelector(state => state)
    const [disabled, setDisabled] = useState(true)

    const user = state.user

    return (
        <Container>
            <Input options={{
                type: 'text',
                name: 'name',
                value: user.name,
                onChange: () => {
                    setDisabled(false)
                }
            }} />
            <Button options={{
                type: 'inactive',
                disabled, handler: () => {
                    jump('/privacy-and-security')
                }
            }}>
                <p>Save Changes</p>
            </Button>
        </Container>
    )
}

const SettingsHomeContent = ({ jump, close }) => {
    const auth = useContext(AuthContext)
    const dispatch = useDispatch()

    return (
        <Container>
            <Button options={{
                type: 'inactive',
                handler: () => jump('/edit')
            }}>
                <FontAwesomeIcon icon={faPen} />
                <p>Edit profile</p>
            </Button>
            <Button options={{
                type: 'inactive',
                handler: () => jump('/privacy-and-security')
            }}>
                <FontAwesomeIcon icon={faLock} />
                <p>Privacy and Security</p>
            </Button>

            <Divider />
            
            <Row type="col2">
                <Button options={{
                    type: 'inactive',
                    handler: () => jump('/language')
                }}>
                    <FontAwesomeIcon icon={faFlag} />
                    <p>Language</p>
                </Button>
                <Button options={{
                    type: 'inactive',
                    handler: () => jump('/ask-a-question')
                }}>
                    <FontAwesomeIcon icon={faQuestion} />
                    <p>Ask a question</p>
                </Button>
            </Row>

            <Divider />
            
            <Button options={{
                type: 'active clear',
                handler: () => {
                    close()
                    dispatch(setUser(null))
                    auth.logout()
                }
            }}>
                <p>Log Out</p>
            </Button>
        </Container>
    )
}

const SettingsQuestionContent = ({ back }) => {
    const [disabled, setDisabled] = useState(true)

    return (
        <Container>
            <Input options={{
                type: 'text',
                name: 'title',
                placeholder: 'Enter topic question',
                onChange: () => {
                    setDisabled(false)
                }
            }} />
            <TextArea options={{
                name: 'body',
                placeholder: 'Enter content question',
                onChange: () => {
                    setDisabled(false)
                }
            }} />
            <Button options={{
                type: 'inactive',
                disabled, handler: () => {
                    back()
                }
            }}>
                <p>Submit</p>
            </Button>
        </Container>
    )
}

const SettingsLanguageContent = ({ back }) => {
    const langs = [
        { id: 0, value: 'English' },
        { id: 1, value: 'Русский' },
        { id: 2, value: 'Белоруская' }
    ]
    const [checked, setChecked] = useState(langs[0])
    const [disabled, setDisabled] = useState(true)

    return (
        <Container>
            <Divider />

            <List options={{ list: langs }}>
                {({ item }) => (
                    <div
                        className={`ui-item${(checked.id === item.id) ? ' checked' : ''}`}
                        onClick={() => {
                            setChecked(item)
                            setDisabled(false)
                        }}
                    >
                        <p className="name">{item.value}</p>
                    </div>
                )}
            </List>

            <Button options={{
                type: 'inactive',
                disabled, handler: () => {
                    back()
                }
            }}>
                <p>Apply</p>
            </Button>
        </Container>
    )
}

const Content = () => {
    const state = useSelector(state => state)
    const { isAuthenticated, logout } = useContext(AuthContext)

    const [closeByBackground, setClosedByBackground] = useState(true)
    const [content, setModal] = useState()
  
    const showModal = (content) => setModal(content)
    const hideModal = () => setModal(null)

    useEffect(() => {
        if ((state.user) && !state.user.avatar) {
            setClosedByBackground(false)
            showModal([
                {
                    path: '/',
                    title: 'Choose your Avatar',
                    component: () => <InfoImage />
                }
            ])
        }
    }, [state.user, logout])

    return (
        <React.Fragment>
            {(isAuthenticated) && <Navigation options={{
                links, buttons: [
                    getButton(showModal, [
                        {
                            path: '/',
                            title: 'Notifications',
                            component: () => <InfoImage />
                        }
                    ], faBell),
                    getButton(showModal, [
                        {
                            path: '/',
                            title: 'Settings',
                            component: ({ jump, close }) => <SettingsHomeContent jump={jump} close={close} />
                        },
                        {
                            path: '/edit',
                            title: 'Edit Profile',
                            component: ({ jump }) => <SettingsEditProfileContent jump={jump} />
                        },
                        {
                            path: '/privacy-and-security',
                            title: 'Privacy and Security',
                            component: ({ jump }) => <InfoImage jump={jump} /> //<SettingsPrivacySecurityContent jump={jump} />
                        },
                        {
                            path: '/language',
                            title: 'Select language',
                            component: ({ back }) => <SettingsLanguageContent back={back} />
                        },
                        {
                            path: '/ask-a-question',
                            title: 'Ask a Question',
                            component: ({ back }) => <SettingsQuestionContent back={back} />
                        }
                    ], faCog)
                ]
            }} />}

            <Switch>
                {(isAuthenticated) ? routes.map((props, key) =>
                    <Route
                        {...props}
                        key={key}
                        component={() => props.component({ showModal, hideModal })}
                    />
                ) :
                    <Route
                        exact
                        path="/auth"
                        component={({ showModal }) =>
                            <Auth showModal={showModal} />
                        }
                    />
                }
                <Redirect to={(isAuthenticated) ? '/' : '/auth'} />
            </Switch>
            
            <Modal options={{
                routes: content,
                closeByBackground,
                hideModal
            }} />
        </React.Fragment>
    )
}

const WithUser = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const { data, loading, error } = useQuery(GET_USER)

    useEffect(() => {
        if (data && data.getUser) {
            dispatch(setUser(data.getUser))
        }
    }, [data, dispatch])

    if (loading && !state.user) {
        return (
            <main className="skeleton">
                <aside>
                    <Container>
                        <Skeleton options={{ height: '85px' }} />
                        <Skeleton options={{ height: '45px' }} />
                    </Container>
                    <Container>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Container>
                </aside>

                
                <aside>
                    <Row type="flex">
                        <Skeleton options={{ height: '45px' }} />
                        <Skeleton options={{ height: '45px' }} />
                        <Skeleton options={{ height: '45px' }} />
                        <Skeleton options={{ height: '45px' }} />
                        <Skeleton options={{ height: '45px' }} />
                    </Row>
                    <Row type="flex">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Row>
                </aside>

                
                <aside>
                    <Container>
                        <Skeleton options={{ height: '85px' }} />
                        <Skeleton options={{ height: '45px' }} />
                    </Container>
                    <Container>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Container>
                </aside>
            </main>
        )
    }

    if (error) {
        return <p>Error</p>
    }

    return <Content />
}

export default () => {
    const { sessionID } = useContext(AuthContext)

    if (sessionID)
        return <WithUser />

    return <Content />
}