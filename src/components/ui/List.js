/*
 * COMPONENT: List
 * 
 * MISSION: ...
 *
**/

import React from 'react'
import '../styles/List.css'

export default ({ options }) => {
    const {
        type,
        items
    } = options

    const classes = [
        'ui-list',
        type
    ]

    return (
        <ul className={classes.join(' ')}>
            {items.map((item, key) =>
                <li key={key} {...item.props}>{item.content}</li>    
            )}
        </ul>
    )
}