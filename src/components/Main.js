import React, { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faCompass,
    faPaperPlane,
    // eslint-disable-next-line 
    faTrophy,
    faBell,
    faCog
} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthContext'

import Navigation from './ui/Navigation'
import Modal from './ui/Modal'

import ViewEmpty from './content/ViewEmpty'
import ViewNotifications from './content/ViewNotifications'
import {
    SettingsEditProfileContent,
    SettingsHomeContent,
    SettingsQuestionContent,
    SettingsLanguageContent
} from './content/ViewSettings'
import {
    SetupGreeting,
    SetupChooseAvatar,
    SetupChoosePreferences,
    SetupCongratulations
} from './content/ViewSetup'

import Auth from './Auth'
import { setChat } from '../utils/actions'
import { config } from '../utils/config'
import SVGLogo from '../assets/images/logo'

import routes from '../routes'
import '../assets/styles/App.css'

const api = config.get('api')

function getButton(handler, routes, icon) {
    return ({
        options: {
            type: 'large-round',
            handler: () => handler(routes, true)
        },
        component: <FontAwesomeIcon icon={icon} />
    })
}

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
                links: [
                    {
                        path: '/profile',
                        handler: () => dispatch(setChat(null)),
                        component: (state.user && state.user.avatar.path) ? <img
                            className="image"
                            src={(state.user.avatar.path).replace('./', `${api}/`)}
                            alt="Avatar"
                        /> : <p className="undefined"><FontAwesomeIcon icon={faUser} /></p>
                    },
                    {
                        path: '/',
                        handler: () => dispatch(setChat(null)),
                        component: SVGLogo
                    },
                    {
                        path: '/navigator',
                        component: <FontAwesomeIcon icon={faCompass} />
                    },
                    {
                        path: '/chats',
                        handler: () => dispatch(setChat(null)),
                        component: <FontAwesomeIcon icon={faPaperPlane} />
                    }
                ],
                buttons: [
                    getButton(showModal, [
                        {
                            path: '/',
                            title: 'Notifications',
                            component: () => <ViewNotifications />
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
                    ], faCog)
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