import React from 'react'
import Avatar from './Avatar'
import List from './List'
import Message from './Message'
import CounterBadge from './CounterBadge'
import ViewEmpty from './../content/ViewEmpty'

export default ({ options }) => {
    const {
        type,
        act,
        handler
    } = options || {}

    const classes = [
        'ui-act',
        type
    ]

    return (
        <div className={classes.join(' ')}>
            <h2 className="title">{act.title}</h2>
            <p className="description">{act.description}</p>

            {(act.tasks.length > 0) ? <List options={{
                list: act.tasks,
                handlerItem: (item) => handler(item)
            }}>
                {({ item }) => (
                    <React.Fragment>
                        <Avatar avatar={{ path: item.icon.path }} />
                        <p className="name">{item.title}</p>
                    </React.Fragment>
                )}
            </List>
            : <Message text="No Content" padding />}
        </div>
    )
}