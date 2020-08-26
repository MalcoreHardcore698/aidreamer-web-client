import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/Achievement.css'

export default ({ achievement }) => {
    return (
        <div className="ui-achievement">
            <div className="icon">
                <FontAwesomeIcon icon={achievement.icon} />
            </div>
            <div className="message">{achievement.message}</div>
            <div className="points">{achievement.points}</div>
        </div>
    )
}