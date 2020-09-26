import React, { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, Redirect, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faCompass,
    faPaperPlane,
    faTrophy,
    faBell,
    faBars,
    faCog
} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/Auth'
import Navigation from './ui/Navigation'
import Button from './ui/Button'
import Modal from './ui/Modal'
import ViewEmpty from './views/Empty'
import ViewNotifications from './views/Notifications'
import ViewMenu from './views/Menu'
import {
    SettingsEditProfileContent,
    SettingsHomeContent,
    SettingsQuestionContent,
    SettingsLanguageContent
} from './views/Settings'
import {
    SetupGreeting,
    SetupChooseAvatar,
    SetupChoosePreferences,
    SetupCongratulations
} from './views/Setup'
import Auth from './Auth'
import { setChat } from '../utils/actions'
import { config } from '../utils/config'
import SVGLogo from '../assets/images/logo'
import routes from '../routes'
import '../assets/styles/App.css'

const api = config.get('api')

const Content = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const { logout } = useContext(AuthContext)

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

    const getOptions = (routes, isCenter=true) => ({
        type: 'large-round',
        handler: () => showModal(routes, isCenter)
    })

    useEffect(() => {
        if ((state.user) && !state.user.avatar.path) {
            setClosedByBackground(false)
            showModal([
                {
                    path: '/',
                    title: 'Welcome to AidReamer!',
                    component: ({ jump }) => <SetupGreeting jump={jump} />
                },
                {
                    path: '/choose-avatar',
                    title: 'Step 1: Choose your avatar',
                    component: ({ jump }) => <SetupChooseAvatar jump={jump} />
                },
                {
                    path: '/choose-preferences',
                    title: 'Step 2: Choose your favourites games',
                    component: ({ jump }) => <SetupChoosePreferences jump={jump} />
                },
                {
                    path: '/congratulations',
                    title: 'Congratulations!',
                    component: ({ close }) => <SetupCongratulations close={close} />
                }
            ], true)
        }
    }, [state.user, logout])

    return (
        <React.Fragment>
            <Navigation options={{
                left: [
                    <NavLink
                        exact
                        to={'/'}
                        onClick={() => dispatch(setChat(null))}
                    >
                        {SVGLogo}
                    </NavLink>,
                    <NavLink
                        exact
                        to={'/profile'}
                        onClick={() => dispatch(setChat(null))}
                    >
                        {(state.user && state.user.avatar.path) ? <img
                            className="image"
                            src={(state.user.avatar.path).replace('./', `${api}/`)}
                            alt="Avatar"
                        />
                        : <p className="undefined"><FontAwesomeIcon icon={faUser} /></p>}
                    </NavLink>,
                    <NavLink
                        exact
                        to={'/navigator'}
                        onClick={() => dispatch(setChat(null))}
                    >
                        <FontAwesomeIcon icon={faCompass} />
                    </NavLink>,
                    <NavLink
                        exact
                        to={'/chats'}
                        onClick={() => dispatch(setChat(null))}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </NavLink>,
                    <NavLink
                        exact
                        to={'/tours'}
                        onClick={() => dispatch(setChat(null))}
                    >
                        <FontAwesomeIcon icon={faTrophy} />
                    </NavLink>
                ],
                right: [
                    <Button options={getOptions([
                        {
                            path: '/',
                            title: 'Notifications',
                            component: () => <ViewNotifications />
                        }
                    ])}>
                        <FontAwesomeIcon icon={faBell} />
                    </Button>,
                    <Button options={getOptions([
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
                            component: ({ jump }) => <ViewEmpty jump={jump} /> //<SettingsPrivacySecurityContent jump={jump} />
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
                    ])}>
                        <FontAwesomeIcon icon={faCog} />
                    </Button>,
                    <Button options={getOptions([
                        {
                            path: '/',
                            title: 'Menu',
                            component: ({ close }) => <ViewMenu close={close} />
                        }
                    ])}>
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                ]
            }} />

            <Switch>
                {routes.map((props, key) =>
                    <Route
                        {...props}
                        key={key}
                        component={() => props.component({ showModal, hideModal })}
                    />
                )}
                <Redirect to="/" />
            </Switch>
            
            <Modal options={{
                routes: content,
                closeByBackground,
                center, hideModal
            }} />
        </React.Fragment>
    )
}

export default () => {
    const { isAuthenticated } = useContext(AuthContext)

    return (
        <Switch>
            {(isAuthenticated && 
                <Route
                    path="/"
                    component={({ showModal }) =>
                        <Content showModal={showModal} />
                    }
                />
            )}

            {(!isAuthenticated) && (
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
    )
}