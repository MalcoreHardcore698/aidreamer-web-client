import React from 'react'
import Participant from './Participant'
import '../styles/Match.css'

export default ({ options }) => {
    const {
        match,
        handler
    } = options || {}

    return (
        <div className="ui-match" onClick={handler}>
            {match.map(participant =>
                <Participant participant={participant} />    
            )}
        </div>
    )
}