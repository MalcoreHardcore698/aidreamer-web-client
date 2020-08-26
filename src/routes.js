import React from 'react'
import Home from './components/Home'
import Auth from './components/Auth'
import Profile from './components/Profile'
import Navigator from './components/Navigator'
import Tours from './components/Tours'
import Chats from './components/Chats'

export default [
    {
        exact: true,
        path: '/',
        component: ({ showModal }) => <Home showModal={showModal} />
    },
    {
        exact: true,
        path: '/auth',
        component: ({ showModal }) => <Auth showModal={showModal} />
    },
    {
        exact: true,
        path: '/profile',
        component: ({ showModal }) => <Profile showModal={showModal} />
    },
    {
        exact: true,
        path: '/navigator',
        component: ({ showModal }) => <Navigator showModal={showModal} />
    },
    {
        exact: true,
        path: '/tours',
        component: ({ showModal }) => <Tours showModal={showModal} />
    },
    {
        exact: true,
        path: '/chats',
        component: ({ showModal }) => <Chats showModal={showModal} />
    }
]