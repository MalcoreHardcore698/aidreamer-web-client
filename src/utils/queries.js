import gql from 'graphql-tag'

// BEGIN USER
export const LOGIN = gql`
    mutation login(
        $name: String!
        $password: String!
        $area: String
    ) {
        login(
            name: $name
            password: $password
            area: $area
        ) {
            id
            name
            email
            phone
            role {
                name
            }
            balance
            level
            experience
            avatar {
                id
                name
                path
            }
            preferences {
                id
                title
                color
                slogan
                icon {
                    name
                    path
                }
            }
            sessionID
            updatedAt
            createdAt
        }
    }
`

export const REGISTER = gql`
    mutation register(
        $name: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
        $phone: String
        $role: ID
        $avatar: ID
    ) {
        register(
            registerInput: {
                name: $name
                email: $email
                password: $password
                confirmPassword: $confirmPassword
                phone: $phone
                role: $role
                avatar: $avatar
            }
        ) {
            name
            email
            phone
            role {
                name
            }
            balance
            level
            experience
            avatar {
                id
                name
                path
            }
            preferences {
                id
                title
                color
                slogan
                icon {
                    name
                    path
                }
            }
            sessionID
            updatedAt
            createdAt
        }
    }
`

export const GET_ALL_USERS = gql`
    query allUsers {
        allUsers {
            name
            email
            phone
            role {
                name
            }
            balance
            level
            experience
            avatar {
                id
                name
                path
            }
            preferences {
                id
                title
                color
                slogan
                icon {
                    name
                    path
                }
            }
            updatedAt
            createdAt
        }
    }
`

export const SUB_ALL_USERS = gql`
    subscription users {
        users {
            name
            email
            phone
            role {
                name
            }
            balance
            level
            experience
            avatar {
                id
                name
                path
            }
            preferences {
                id
                title
                color
                slogan
                icon {
                    name
                    path
                }
            }
            updatedAt
            createdAt
        }
    }
`

export const GET_USER = gql`
    query getUser {
        getUser {
            name
            password
            email
            phone
            role {
                name
            }
            balance
            level
            experience
            avatar {
                id
                name
                path
            }
            preferences {
                id
                title
                color
                slogan
                icon {
                    name
                    path
                }
            }
            updatedAt
            createdAt
        }
    }
`

export const EDIT_USER = gql`
    mutation editUser(
        $name: String
        $email: String
        $password: String
        $phone: String
        $role: ID
        $balance: Int
        $level: Int
        $avatar: ID
        $availableAvatars: [ID]
        $experience: Int
        $preferences: [ID]
        $settings: [Setting]
    ) {
        editUser(
            name: $name
            email: $email
            password: $password
            phone: $phone
            role: $role
            balance: $balance
            level: $level
            avatar: $avatar
            availableAvatars: $availableAvatars
            experience: $experience
            preferences: $preferences
            settings: $settings
        )
    }
`

export const DELETE_USERS = gql`
    mutation deleteUsers(
        $id: [ID]
    ) {
        deleteUsers(id: $id)
    }
`

export const GET_USER_CHATS = gql`
    query allUserChats {
        allUserChats {
            id
            chat {
                id
                title
                members {
                    name
                    avatar {
                        path
                    }
                }
                messages {
                    user {
                        name
                        avatar {
                            path
                        }
                    }
                    text
                    type
                    updatedAt
                    createdAt
                }
            }
            interlocutor {
                name
                avatar {
                    path
                }
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const GET_CHAT_MESSAGES = gql`
    query allChatMessages(
        $id: ID!
    ) {
        allChatMessages(
            id: $id
        ) {
            user {
                name
                avatar {
                    path
                }
            }
            text
            type
            updatedAt
            createdAt
        }
    }
`

export const SUB_USER_CHATS = gql`
    subscription userChats(
        $name: String!
    ) {
        userChats(
            name: $name
        ) {
            id
            chat {
                id
                title
                members {
                    name
                    avatar {
                        path
                    }
                }
                messages {
                    user {
                        name
                        avatar {
                            path
                        }
                    }
                    text
                    type
                    updatedAt
                    createdAt
                }
            }
            interlocutor {
                name
                avatar {
                    path
                }
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const SUB_MESSAGES = gql`
    subscription messages(
        $id: ID
    ) {
        messages(
            id: $id
        ) {
            user {
                name
            }
            text
            type
            updatedAt
            createdAt
        }
    }
`

export const OPEN_USER_CHAT = gql`
    mutation openUserChat(
        $name: String!
    ) {
        openUserChat(
            name: $name
        ) {
            id
            chat {
                id
                title
                members {
                    name
                    avatar {
                        path
                    }
                }
                messages {
                    user {
                        name
                        avatar {
                            path
                        }
                    }
                    text
                    type
                    updatedAt
                    createdAt
                }
            }
            interlocutor {
                name
                avatar {
                    path
                }
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const ADD_USER_CHAT_MESSAGE = gql`
    mutation addUserChatMessage(
        $id: ID!
        $text: String!
    ) {
        addUserChatMessage(
            id: $id
            text: $text
        )
    }
`

export const SUB_NOTIFICATIONS = gql`
    subscription notifications {
        notifications {
            id
            text
            createdAt
        }
    }
`

export const GET_USER_NOTIFICATIONS = gql`
    query allUserNotifications {
        allUserNotifications {
            id
            text
            createdAt
        }
    }
`
// END USER

// BEGIN HUB
export const GET_ALL_HUBS = gql`
    query allHubs($status: Status) {
        allHubs(status: $status) {
            id
            title
            description
            slogan
            icon {
                id
                name
                path
            }
            color
            status
            updatedAt
            createdAt
        }
    }
`

export const SUB_ALL_HUBS = gql`
    subscription hubs(
        $status: Status
    ) {
        hubs(
            status: $status
        ) {
            id
            title
            description
            slogan
            icon {
                path
            }
            color
            countUsers
            countOffers
            status
            updatedAt
            createdAt
        }
    }
`

export const ADD_HUB = gql`
    mutation addHub(
        $title: String!
        $description: String!
        $slogan: String!
        $color: String
        $icon: ID
        $status: Status!
    ) {
        addHub(
            title: $title
            description: $description
            slogan: $slogan
            color: $color
            icon: $icon
            status: $status
        )
    }
`

export const EDIT_HUB = gql`
    mutation editHub(
        $id: ID!
        $title: String
        $description: String
        $slogan: String
        $color: String
        $icon: ID
        $status: Status
    ) {
        editHub(
            id: $id
            title: $title
            description: $description
            slogan: $slogan
            color: $color
            icon: $icon
            status: $status
        )
    }
`

export const DELETE_HUBS = gql`
    mutation deleteHubs(
        $id: [ID]
    ) {
        deleteHubs(id: $id)
    }
`
// END HUB

// BEGIN ARTICLE
export const GET_USER_ARTICLES = gql`
    query allUserArticles {
        allUserArticles {
            id
            title
            description
            body
            views
            image {
                path
            }
            comments {
                id
                user {
                    name
                    avatar {
                        path
                    }
                }
                text
                updatedAt
                createdAt
            }
            hub {
                id
                title
            }
            author {
                id
                name
            }
            updatedAt
            createdAt
        }
    }
`

export const GET_ALL_ARTICLES = gql`
    query allArticles($status: Status) {
        allArticles(status: $status) {
            id
            title
            description
            body
            views
            image {
                path
            }
            comments {
                id
                user {
                    name
                    avatar {
                        path
                    }
                }
                text
                updatedAt
                createdAt
            }
            hub {
                id
                title
            }
            author {
                id
                name
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const SUB_USER_ARTICLES = gql`
    subscription userArticles(
        $name: String!
    ) {
        userArticles(
            name: $name
        ) {
            id
            title
            description
            body
            views
            image {
                path
            }
            comments {
                id
                user {
                    name
                    avatar {
                        path
                    }
                }
                text
                updatedAt
                createdAt
            }
            hub {
                id
                title
            }
            author {
                id
                name
            }
            updatedAt
            createdAt
        }
    }
`

export const SUB_ARTICLES = gql`
    subscription articles(
        $status: Status
    ) {
        articles(
            status: $status
        ) {
            id
            title
            description
            body
            views
            image {
                path
            }
            comments {
                id
                user {
                    name
                    avatar {
                        path
                    }
                }
                text
                updatedAt
                createdAt
            }
            hub {
                id
                title
            }
            author {
                id
                name
            }
            updatedAt
            createdAt
        }
    }
`

export const GET_ARTICLE = gql`
    query getArticle($id: ID!) {
        getArticle(id: $id) {
            id
            title
            description
            body
            image {
                id
                name
                path
            }
            comments {
                id
                user {
                    name
                    avatar {
                        path
                    }
                }
                text
                updatedAt
                createdAt
            }
            hub {
                id
                title
            }
            source
            url
            updatedAt
            createdAt
        }
    }
`

export const ADD_ARTICLE = gql`
    mutation addArticle(
        $author: String!
        $title: String!
        $description: String!
        $body: String!
        $hub: ID!
        $image: Upload
        $status: Status!
    ) {
        addArticle(
            author: $author
            title: $title
            description: $description
            body: $body
            hub: $hub
            image: $image
            status: $status
        )
    }
`

export const EDIT_ARTICLE = gql`
    mutation editArticle(
        $id: ID!
        $title: String
        $description: String
        $body: String
        $hub: ID
        $image: Upload
        $status: Status
    ) {
        editArticle(
            id: $id
            title: $title
            description: $description
            body: $body
            hub: $hub
            image: $image
            status: $status
        )
    }
`

export const DELETE_ARTICLES = gql`
    mutation deleteArticles(
        $articles: [InputArticle]
    ) {
        deleteArticles(articles: $articles)
    }
`

export const ADD_COMMENT = gql`
    mutation addComment(
        $article: ID!
        $text: String!
    ) {
        addComment(
            article: $article
            text: $text
        )
    }
`

export const EDIT_COMMENT = gql`
    mutation editComment(
        $id: ID!
        $article: ID
        $user: ID
        $text: String
    ) {
        editComment(
            id: $id
            article: $article
            user: $user
            text: $text
        )
    }
`

export const DELTE_COMMENTS = gql`
    mutation deleteComments(
        $id: [ID]!
        $article: ID!
    ) {
        deleteComments(
            id: $id
            article: $article
        )
    }
`
// END ARTICLE

// BEGIN OFFER
export const GET_USER_OFFERS = gql`
    query allUserOffers {
        allUserOffers {
            id
            title
            message
            user {
                id
                name
            }
            hub {
                id
                title
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const SUB_USER_OFFERS = gql`
    subscription userOffers(
        $name: String!
    ) {
        userOffers(
            name: $name
        ) {
            id
            title
            message
            user {
                id
                name
            }
            hub {
                id
                title
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const GET_ALL_OFFERS = gql`
    query allOffers($status: Status) {
        allOffers(status: $status) {
            id
            title
            message
            user {
                id
                name
            }
            hub {
                id
                title
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const SUB_ALL_OFFERS = gql`
    subscription offers(
        $status: Status
    ) {
        offers(
            status: $status
        ) {
            id
            title
            message
            user {
                id
                name
            }
            hub {
                id
                title
            }
            status
            updatedAt
            createdAt
        }
    }
`

export const ADD_OFFER = gql`
    mutation addOffer(
        $hub: ID!
        $title: String!
        $message: String!
        $status: Status!
    ) {
        addOffer(
            hub: $hub
            title: $title
            message: $message
            status: $status
        )
    }
`

export const EDIT_OFFER = gql`
    mutation editOffer(
        $id: ID!
        $hub: ID
        $title: String
        $message: String
        $status: Status
    ) {
        editOffer(
            id: $id
            hub: $hub
            title: $title
            message: $message
            status: $status
        )
    }
`

export const DELETE_OFFERS = gql`
    mutation deleteOffers(
        $offers: [InputOffer]
    ) {
        deleteOffers(offers: $offers)
    }
`
// END HUB

// BEGIN ROLE
export const GET_ALL_ROLES = gql`
    query allRoles {
        allRoles {
            id
            name
            permissions
            updatedAt
            createdAt
        }
    }
`

export const ADD_ROLE = gql`
    mutation addRole(
        $name: String!
        $permissions: [Permission!]!
    ) {
        addRole(
            name: $name
            permissions: $permissions
        )
    }
`

export const EDIT_ROLE = gql`
    mutation editRole(
        $id: ID!
        $name: String!
        $permissions: [Permission]
    ) {
        editRole(
            id: $id
            name: $name
            permissions: $permissions
        )
    }
`

export const DELETE_ROLES = gql`
    mutation deleteRoles($id: [ID]!) {
        deleteRoles(id: $id)
    }
`

export const SUB_ALL_ROLES = gql`
    subscription roles {
        roles {
            id
            name
            permissions
            updatedAt
            createdAt
        }
    }
`
// END ROLE

// BEGIN PERMITIONS
export const GET_ALL_PERMITIONS = gql`
    query allPermissions {
        allPermissions
    }
`
// END PERMITIONS