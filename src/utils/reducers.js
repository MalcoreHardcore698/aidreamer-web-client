import { combineReducers } from 'redux'
import C from './types'

export function userReducer(state = {}, action) {
    switch (action.type) {
        case C.USER_AUTH:
            return (!action.payload) ? null : ({
                ...state,
                ...action.payload
            })
        case C.USER_PREFERENCES:
            return {
                ...state,
                preferences: action.payload.preferences
            }
        case C.ADD_CHAT:
            return {
                ...state,
                chats: state.chats.map(chat => (chat.userId !== action.payload.chatId) ? ({
                    chatId: action.payload.chatId
                }) : chat),
            }
        case C.CLOSE_CHAT:
            return {
                ...state,
                chats: state.chats.filter(chat =>
                    (chat.chatId !== action.payload.chatId)
                )
            }
        default:
            return state
    }
}

export function documentReducer(state={}, { type, payload }) {
    switch (type) {
        case C.SET_DOCUMENT:
            return payload.document
        default:
            return state
    }
}

export function documentsReducer(state={}, { type, payload }) {
    switch (type) {
        case C.SET_DOCUMENTS:
            return payload.documents
        default:
            return state
    }
}

export function tableReducer(state=[], { type, payload }) {
    switch(type) {
        case C.SET_DATA_TABLE:
            return payload.table
        default:
            return state
    }
}

export const reducers = combineReducers({
    user: userReducer,
    document: documentReducer,
    documents: documentsReducer,
    table: tableReducer
})