/*
 * COMPONENT: List
 * 
 * MISSION: ...
 *
**/

import React from 'react'
import '../styles/List.css'

export default (props) => {
    const Children = props.children

    const {
        list,
        handler,
    } = props.options || {}

    return (
        <div
            className={`ui-list${(handler) ? ' clickable' : ''}`}
            onClick={handler}
        >
            {list.map((item, key) => (
                <div className="ui-item">
                    <Children key={key} item={item} />
                </div>
            ))}
        </div>
    )
}