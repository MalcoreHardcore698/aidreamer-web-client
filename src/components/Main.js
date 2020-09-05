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
import EnglishFlagIcon from '../assets/icons/united-kingdom.svg'
import RussianFlagIcon from '../assets/icons/russia.svg'
import BelarusFlagIcon from '../assets/icons/belarus.svg'
import { AuthContext } from './AuthContext'
import Row from './ui/Row'
import Navigation from './ui/Navigation'
import Container from './ui/Container'
import Message from './ui/Message'
import Button from './ui/Button'
import Modal from './ui/Modal'
import List from './ui/List'
import Alert from './ui/Alert'
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
            handler: () => handler(routes, true)
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
                state: 'inactive',
                classNames: 'grow',
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
                state: 'inactive',
                classNames: 'grow',
                handler: () => jump('/edit')
            }}>
                <FontAwesomeIcon icon={faPen} />
                <p>Edit profile</p>
            </Button>
            <Button options={{
                state: 'inactive',
                classNames: 'grow',
                handler: () => jump('/privacy-and-security')
            }}>
                <FontAwesomeIcon icon={faLock} />
                <p>Privacy and Security</p>
            </Button>

            <Divider />
            
            <Row type="col2">
                <Button options={{
                    state: 'inactive',
                    classNames: 'grow',
                    handler: () => jump('/language')
                }}>
                    <FontAwesomeIcon icon={faFlag} />
                    <p>Language</p>
                </Button>
                <Button options={{
                    state: 'inactive',
                    classNames: 'grow',
                    handler: () => jump('/ask-a-question')
                }}>
                    <FontAwesomeIcon icon={faQuestion} />
                    <p>Ask a question</p>
                </Button>
            </Row>

            <Divider />
            
            <Button options={{
                state: 'active clear',
                classNames: 'grow',
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
                state: 'inactive',
                classNames: 'grow',
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
        { id: 0, icon: EnglishFlagIcon, label: 'English' },
        { id: 1, icon: RussianFlagIcon, label: 'Русский' },
        { id: 2, icon: BelarusFlagIcon, label: 'Белоруская' }
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
                        <p className="avatar">
                            <img src={item.icon} alt="User" />
                        </p>
                        <p className="name">{item.label}</p>
                    </div>
                )}
            </List>

            <Button options={{
                type: 'inactive',
                classNames: 'grow',
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
    const [center, setCenterModal] = useState(false)
  
    const showModal = (content, center=false) => {
        setModal(content)
        setCenterModal(center)
        document.body.style.overflow = 'hidden'
    }
    const hideModal = () => {
        setModal(null)
        setCenterModal(false)
        document.body.style.overflow = 'initial'
    }

    useEffect(() => {
        if ((state.user) && !state.user.avatar) {
            setClosedByBackground(false)
            showModal([
                {
                    path: '/',
                    title: 'Choose your Avatar',
                    component: () => <InfoImage />
                }
            ], true)
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
                {(isAuthenticated && 
                    <React.Fragment>
                        {routes.map((props, key) =>
                            <Route
                                {...props}
                                key={key}
                                component={() => props.component({ showModal, hideModal })}
                            />
                        )}
                        <Redirect from="/auth" to={`/`} />
                    </React.Fragment>
                )}

                {(!isAuthenticated && 
                    <React.Fragment>
                        <Route
                            path="/auth"
                            component={({ showModal }) =>
                                <Auth showModal={showModal} />
                            }
                        />
                        <Redirect to="/auth" />
                    </React.Fragment>
                )}
            </Switch>
            
            <Modal options={{
                routes: content,
                closeByBackground,
                center, hideModal
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
        return (
            <main className="alert">
                <Alert type="error" message="Sorry, site is temporarily unavailable" />
            </main>
        )
    }

    return <Content />
}

export default () => {
    const { sessionID } = useContext(AuthContext)

    if (sessionID)
        return <WithUser />

    return <Content />
}