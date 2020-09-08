import React from 'react'
import Container from './../ui/Container'
import Query from './../ui/Query'
import Subscription from './../ui/Subscription'
import Message from './../ui/Message'
import Notify from './../ui/Notify'

import {
    GET_USER_NOTIFICATIONS,
    SUB_NOTIFICATIONS
} from '../../utils/queries'

export default () => {
    return (
        <Container>
            <Query query={GET_USER_NOTIFICATIONS} pseudo={{ height: 45, count: 6 }}>
                {({ data, refetch }) => (
                    <Subscription query={SUB_NOTIFICATIONS} refetch={refetch}>
                        {({ subData }) => {
                            const notifications = ((subData && subData.notifications) || data.allUserNotifications)

                            if (notifications.length === 0)
                                return <Message text="Empty" padding />

                            return (
                                <div className="grid">
                                    {notifications.map((notification, key) =>
                                        <Notify key={key} options={{
                                            message: notification.text,
                                            avatar: notification.img
                                        }} />    
                                    )}
                                </div>
                            )
                        }}
                    </Subscription>
                )}
            </Query>
        </Container>
    )
}