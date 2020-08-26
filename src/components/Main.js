import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faPaperPlane, faTrophy, faBell, faCog } from '@fortawesome/free-solid-svg-icons'
import Navigation from './ui/Navigation'
import Container from './ui/Container'
import Message from './ui/Message'
import Modal from './ui/Modal'
import Auth from '../components/Auth'

import ImageAvatar from '../assets/images/avatar.png'
import SVGLogo from '../assets/images/logo'

import routes from '../routes'
import '../assets/styles/App.css'

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
    {
        path: '/tours',
        component: <FontAwesomeIcon icon={faTrophy} />
    },
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

export default ({ isAuthenticated }) => {
    const [state, setModal] = useState()
  
    const showModal = (state) => setModal(state)
    const hideModal = () => setModal(null)
    
    function getButton(handler, routes, icon) {
        return ({
            options: {
                type: 'large-round',
                handler: () => handler(routes)
            },
            component: <FontAwesomeIcon icon={icon} />
        })
    }

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
                            component: () => <InfoImage />
                        }
                    ], faCog)
                ]
            }} />}

            <Switch>
                {(isAuthenticated) ? routes.map((props, key) =>
                    <Route
                        {...props}
                        key={key}
                        component={() => props.component({ showModal })}
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
                routes: state,
                hideModal
            }} />
        </React.Fragment>
    )
}