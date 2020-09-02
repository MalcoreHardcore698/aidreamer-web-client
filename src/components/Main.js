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
    faBell,
    faCog
} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthContext'
import Navigation from './ui/Navigation'
import Container from './ui/Container'
import Message from './ui/Message'
import Button from './ui/Button'
import Modal from './ui/Modal'
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

const SettingsContent = ({ hideModal }) => {
    const auth = useContext(AuthContext)
    const dispatch = useDispatch()

    return (
        <Container>
            <Button options={{
                typa: 'inactive',
                handler: () => {
                    hideModal()
                    dispatch(setUser(null))
                    auth.logout()
                }
            }}>
                <p>Sign Out</p>
            </Button>
        </Container>
    )
}

const AuthMain = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const { userId } = useContext(AuthContext)

    const { data, loading, error } = useQuery(GET_USER, {
            variables: {
                sessionID: userId
            }
        }
    )

    console.log(userId)

    useEffect(() => {
        if (data && data.getUser) {
            dispatch(setUser(data.getUser))
        }
    }, [data, dispatch])

    if (loading && !state.user) {
        return <p>Loading</p>
    }

    if (error) {
        return <p>Error</p>
    }

    return <Content />
}

const Content = () => {
    const state = useSelector(state => state)
    const { isAuthenticated, logout } = useContext(AuthContext)

    const [closeByBackground, setClosedByBackground] = useState(true)
    const [content, setModal] = useState()
  
    const showModal = (content) => setModal(content)
    const hideModal = () => setModal(null)

    useEffect(() => {
        if (!state.user) return logout()
        // CURRECT: ((state.user) && !state.user.avatar)
        // TODO: When to ready Avatar Library and Admin Panel
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
                            component: () => <SettingsContent hideModal={hideModal} />
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

export default () => {
    const { isAuthenticated } = useContext(AuthContext)

    if (isAuthenticated) return <AuthMain />
    return <Content />
}