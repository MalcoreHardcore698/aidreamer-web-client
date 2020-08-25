/*
 * COMPONENT: Entry
 * 
 * MISSION: Space between components
 *
**/

import React from 'react'

export default ({ distance }) => {
    const classes = [
        'ui-divider'
    ]

    return (
        <div
            className={classes.join(' ')}
            style={{ height: distance }}
        />
    )
}