/*
 * COMPONENT: TextArea
 * 
 * MISSION: ...
 *
**/

import React from 'react'

export default ({ options }) => {
    const {
        type,
        placeholder='Write a message...',
        onChange=() => {}, resize=false
    } = options || {}

    const classes = [
        'ui-textarea',
        type
    ]

    return (
        <textarea
            className={classes.join(' ')}
            placeholder={placeholder}
            style={{ resize: (resize) ? 'auto' : 'none' }}
            onChange={onChange}
        />
    )
}