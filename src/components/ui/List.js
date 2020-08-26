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
        handler
    } = props.options || {}

    return (
        <div className="ui-list" onClick={handler}>
            {list.map(item =>
                <div className="ui-item">
                    <Children item={item} />
                </div>
            )}
        </div>
    )
}