/*
 * COMPONENT: Entry
 * 
 * MISSION: ...
 *
**/

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import Message from './Message'
import Button from './Button'
import Row from './Row'
import '../styles/Entry.css'

const Manage = ({ manageOffset, handlerEdit, handlerDelete }) => {
    return (
        <Row className="manage" style={{ top: (manageOffset) ? 154 : 15 }}>
            <Button options={{ state: 'icon inactive', handler: handlerEdit }}>
                <FontAwesomeIcon icon={faPen} />
            </Button>
            <Button options={{ state: 'icon inactive', handler: handlerDelete }}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </Row>
    )
}

export default (props) => {
    const Children = props.children

    const {
        capacious=true,
        editable,
        manageOffset=false,
        userBar,
        statusBar,
        classNames,
        handler=() => {},
        handlerEdit=() => {},
        handlerDelete=() => {}
    } = props.options || {}

    const classes = [
        'ui-entry',
        (editable) ? 'editable' : '',
        (capacious) ? 'capacious' : '',
        (userBar) ? '' : 'no-user-bar',
        classNames
    ]

    const renderUserBar = () => {
        if (!userBar)
            return

        return (
            <div className="user-bar">
                <img className="avatar" src={userBar.avatar} alt="Avatar" />
                <p className={`content${(userBar.rightButton) ? ' top-offset' : ''}`}>
                    <span className="name">{userBar.name}</span>
                    <span className="status">{userBar.status}</span>
                </p>

                {(userBar.rightButton) && (userBar.rightButton)}
            </div>
        )
    }

    const renderContent = () => {
        return (
            <div className="content-wrapper" onClick={handler}>
                {(!Children)
                    ? <Message text="No Content" />
                    : <React.Fragment>
                        <div className="content">{Children}</div>
                        {(editable) && <Manage
                            manageOffset={manageOffset}
                            handlerEdit={handlerEdit}
                            handlerDelete={handlerDelete}
                        />}
                    </React.Fragment>
                }
            </div>
        )
    }

    const renderStatusBar = () => {
        if (!statusBar)
            return
        
        return (
            <div className="status-bar">
                {statusBar.options.map((item, key) =>
                    <p key={key}>
                        <span className="lite">{item.lite}</span>
                        <span className="dark">{item.dark}</span>
                    </p>
                )}

                {(statusBar.input) && (
                    <div className="input">{statusBar.input}</div>
                )}
            </div>
        )
    }
    
    return (
        <div className={classes.join(' ')}>
            {renderUserBar()}
            {renderContent()}
            {renderStatusBar()}
        </div>
    )
}