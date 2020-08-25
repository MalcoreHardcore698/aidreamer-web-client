import C from './types'

export function authenticateUser(auth) {
    if (auth) localStorage.setItem('user', JSON.stringify(auth.id))

    return {
        type: C.USER_AUTH,
        payload: auth
    }
}

export function preferencesUser(preferences) {
    return {
        type: C.USER_PREFERENCES,
        payload: {
            preferences
        }
    }
}

export function addChat(chatId) {
    return {
        type: C.ADD_CHAT,
        payload: {
            chatId
        }
    }
}

export function closeChat(chatId) {
    return {
        type: C.CLOSE_CHAT,
        payload: {
            chatId
        }
    }
}

export function addMember(chatId, user) {
    return {
        type: C.ADD_MEMBER,
        payload: {
            chatId, user
        }
    }
}

export function newMessage(userId, chatId, message) {
    return {
        type: C.NEW_MESSAGE,
        payload: {
            userId, chatId, message
        }
    }
}

export function setDocument(document) {
    return {
        type: C.SET_DOCUMENT,
        payload: {
            document
        }
    }
}

export function setDocuments(documents) {
    return {
        type: C.SET_DOCUMENTS,
        payload: {
            documents
        }
    }
}

export function setDataTable(table) {
    return {
        type: C.SET_DATA_TABLE,
        payload: {
            table
        }
    }
}

export function openModal(key, content) {
    return {
        type: C.OPEN_MODAL,
        payload: {
            key, content
        }
    }
}

export function closeModal(key) {
    return {
        type: C.CLOSE_MODAL,
        payload: {
            key
        }
    }
}