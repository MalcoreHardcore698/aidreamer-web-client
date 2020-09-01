import React from 'react'
import Home from './components/Home'
import Profile from './components/Profile'
import Navigator from './components/Navigator'
// eslint-disable-next-line 
import Tours from './components/Tours'
import Chats from './components/Chats'

export default [
    {
        exact: true,
        path: '/',
        component: ({ showModal, hideModal }) => <Home showModal={showModal} hideModal={hideModal} />
    },
    {
        exact: true,
        path: '/profile',
        component: ({ showModal, hideModal }) => <Profile showModal={showModal} hideModal={hideModal} />
    },
    {
        exact: true,
        path: '/navigator',
        component: ({ showModal, hideModal }) => <Navigator showModal={showModal} hideModal={hideModal} />
    },
    /*
    {
        exact: true,
        path: '/tours',
        component: ({ showModal, hideModal }) => <Tours showModal={showModal} hideModal={hideModal} />
    },
    */
    {
        exact: true,
        path: '/chats',
        component: ({ showModal, hideModal }) => <Chats showModal={showModal} hideModal={hideModal} />
    }
]