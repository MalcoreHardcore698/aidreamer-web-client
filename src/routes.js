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
        component: () => <Home />
    },
    {
        exact: true,
        path: '/auth',
        component: () => <Auth />
    },
    {
        exact: true,
        path: '/profile',
        component: () => <Profile />
    },
    {
        exact: true,
        path: '/navigator',
        component: () => <Navigator />
    },
    {
        exact: true,
        path: '/tours',
        component: () => <Tours />
    },
    {
        exact: true,
        path: '/chats',
        component: () => <Chats />
    }
]