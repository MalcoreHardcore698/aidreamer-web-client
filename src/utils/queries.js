import gql from 'graphql-tag'

export const GET_ALL_OFFERS = gql`
    query allOffers($status: Status!) {
        allOffers(status: $status) {
            id
            title
            message
            user {
                id
                name
                avatar {
                    id
                    name
                    path
                }
            }
            hub {
                id
                title
                color
            }
        }
    }
`

export const GET_ALL_HUBS = gql`
    query allHubs($status: Status!) {
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
            poster {
                id
                name
                path
            }
            color
        }
    }
`

export const GET_ALL_NEWS = gql`
    query allNews($status: Status!) {
        allNews(status: $status) {
            id
            title
            body
            image {
                id
                name
                path
            }
            hub {
                title
            }
            datePublished
        }
    }
`

export const GET_NEWS = gql`
    query getNews($id: ID!) {
        getNews(id: $id) {
            id
            title
            body
            image {
                id
                name
                path
            }
            hub {
                id
                title
            }
            source
            url
            datePublished
        }
    }
`

export const GET_ALL_USER_TRANSACTIONS = gql`
    query {
        allUserTransactions {
            id
            title
            date
            sum
        }
    }
`

export const GET_ALL_USER_NOTIFICATIONS = gql`
    query {
        allUserNotifications {
            id
            title
            name
            message
            date
        }
    }
`

export const GET_POPULAR_HUB_CHAT = gql`
    query {
        getPopularHubChat {
            id
            title
            description
            slogan
            members
            offers
        }
    }
`

export const GET_ALL_TOURNAMENTS = gql`
    query {
        allTournaments {
            id
            title
            members
            prize
        }
    }
`

export const GET_ALL_AVATARS = gql`
  query {
    allAvatars {
      id
      order
      name
      path
      complexity
      hub {
        id
        title
        color
        icon {
          id
          path
        }
      }
    }
  }
`

export const GET_USER = gql`
    query getUser($id: ID!) {
        getUser(id: $id) {
            id
            name
            password
            email
            phone
            role
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
            chats {
                chatId
            }
            dateLastAuth
            dateRegistration
            isVerifiedEmail
            isVerifiedPhone
            isNotified
        }
    }
`

export const GET_HUB = gql`
    query getHub($id: ID!) {
        getHub(id: $id) {
            title
            description
            slogan
            icon {
                id
                name
                path
            }
            poster {
                id
                name
                path
            }
            color
            offers {
                title
                message
                user {
                    id
                    name
                    avatar {
                        id
                        name
                        path
                    }
                }
                hub {
                    color
                }
            }
        }
    }
`

export const ADD_CHAT = gql`
    mutation addChat(
        $id: ID!
        $title: String!
        $participants: [UserIDInput!]!
        $owner: ID!
    ) {
        addChat(
            id: $id
            title: $title
            participants: $participants
            owner: $owner
        )
    }
`

export const GET_CHAT = gql`
    query getChat(
        $id: ID!
    ) {
        getChat(
            id: $id
        ) {
            id
            title
            owner
            participants {
                id
                name
                avatar {
                    id
                    path
                }
            }
            messages {
                sender {
                    id
                    name
                    avatar {
                        id
                        path
                    }
                }
                receiver {
                    id
                    name
                    avatar {
                        id
                        path
                    }
                }
                message
                dateCreated
            }
            dateCreated
        }
    }
`

export const CLOSE_USER_CHAT = gql`
    mutation closeUserChat(
        $userId: ID!
        $chatId: ID!
    ) {
        closeUserChat(
            userId: $userId
            chatId: $chatId
        )
    }
`

export const ADD_MESSAGE = gql`
    mutation addMessage(
        $chat: ID!
        $sender: ID!
        $receiver: ID!
        $message: String!
    ) {
        addMessage(
            chat: $chat
            sender: $sender
            receiver: $receiver
            message: $message
        )
    }
`

export const ADD_MESSAGE_SUBSCRIPTION = gql`
    subscription messages($chat: ID!) {
        messages (chat: $chat) {
            id
            message
            sender {
                id
                name
                avatar {
                    id
                    path
                }
            }
            receiver {
                id
                name
                avatar {
                    id
                    path
                }
            }
            dateCreated
        }
    }
`

export const USER_CHAT_SUBSCRIPTION = gql`
    subscription userchats($user: ID!) {
        userchats(user: $user) {
            id
            userId
            chatId
        }
    }
`

export const ADD_OFFER = gql`
  mutation addOffer(
    $title: String!
    $message: String!
    $user: ID!
    $hub: ID!
    $status: Status!
    $dateEdited: String
    $datePublished: String
    $dateCreated: String!
  ) {
    addOffer(
      title: $title
      message: $message
      user: $user
      hub: $hub
      status: $status
      dateEdited: $dateEdited
      datePublished: $datePublished
      dateCreated: $dateCreated
    )
  }
`

export const GET_USER_OFFERS = gql`
    query allUserOffers(
        $id: ID!
    ) {
        allUserOffers(
            id: $id
        ) {
            id
            title
            message
            user {
                id
                name
                avatar {
                    id
                    name
                    path
                }
            }
            hub {
                id
                title
                color
            }
        }
    }
`

export const AUTH_USER = gql`
    query authUser(
        $name: String
        $email: String
        $password: String!
    ) {
        authUser(
            name: $name
            email: $email
            password: $password
        ) {
            id
            name
            password
            email
            phone
            role
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
            }
            dateLastAuth
            dateRegistration
            isVerifiedEmail
            isVerifiedPhone
            isNotified
        }
    }
`