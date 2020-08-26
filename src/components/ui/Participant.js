import React from 'react'
import '../styles/Participant.css'

export default ({ participant }) => {
    return (
        <div className="ui-participant">
            <p className="avatar">
                <img src={participant.avatar} alt="User" />
            </p>
            <p className="name">{participant.name}</p>
            <p className="score">{participant.score}</p>
        </div>
    )
}