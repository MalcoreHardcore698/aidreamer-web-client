import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import Query from '../ui/Query'
import Avatar from '../ui/Avatar'
import Message from '../ui/Message'
import Alert from '../ui/Alert'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Checkbox from '../ui/Checkbox'
import {
    ADD_ACT,
    GET_ALL_AWARDS,
    GET_ALL_CONDITION_ENUMS,
    GET_ALL_USERS,
    GET_ALL_ARTICLES,
    GET_ALL_OFFERS,
    GET_ALL_HUBS
} from '../../utils/queries'

const AREAS_QUERIES = {
    'USER': GET_ALL_USERS,
    'ARTICLE': GET_ALL_ARTICLES,
    'OFFER': GET_ALL_OFFERS,
    'HUB': GET_ALL_HUBS
}

const SpecificSelect = ({ task, condition, specifics, setSpecifics }) => {
    return (
        <Query query={AREAS_QUERIES[specifics.find(_spec => (_spec.taskId === task.id) && (_spec.condId === condition.id)).area.value]} pseudo={{ count: 1, height: 45 }}>
            {({ data }) => (
                <Select options={{
                    value: specifics.find(_spec => (_spec.taskId === task.id) && (_spec.condId === condition.id)).value,
                    placeholder: 'Choose object',
                    options: data[Object.keys(data)[0]].map(a => ({
                        value: a,
                        label: a
                    })),
                    onChange: (e) => {
                        setSpecifics(prev => prev.map(_spec =>
                            (_spec.taskId === task.id) && (_spec.condId === condition.id) ? ({
                                ..._spec,
                                value: e
                            }) : ({
                                ..._spec
                            })    
                        ))
                    }
                }} />
            )}
        </Query>
    )
}

export default ({ close }) => {
    const [action, { loading }] = useMutation(ADD_ACT)

    const [tasks, setTasks] = useState([])
    const [specifics, setSpecifics] = useState([])

    const [isComplexCondition, setComplexCondition] = useState([])

    const { handleSubmit, register, errors } = useForm()
    const onSubmit = async (form) => {
        const variables = {
            title: form.title,
            description: form.description
        }

        await action({ variables })

        close()
    }

    return (
        <form className="fat" onSubmit={handleSubmit(onSubmit)}>
            {(errors.title || errors.description) && <Alert type="error" message={
                errors.title.message || errors.description.message
            } />}

            <Input options={{
                ref: register({ required: 'Title is required' }),
                type: 'text',
                name: 'title',
                disabled: loading,
                placeholder: 'Enter title'
            }} />

            <Input options={{
                ref: register({ required: 'Description is required' }),
                type: 'text',
                name: 'description',
                disabled: loading,
                placeholder: 'Enter description'
            }} />

            <ul className="ui-tasks">
                {(tasks.length > 0) ? tasks.map(task => (
                    <li className="ui-task">
                        <header>
                            <Avatar avatar={{ path: task.icon.path }} />
                            <h2 className="title">{task.title}</h2>
                        </header>

                        <main className="condition">
                            <Button options={{
                                state: 'inactive icon',
                                handler: () => {
                                    setTasks(prev => prev.map(_task =>
                                        (_task.id === task.id) ? ({
                                            ..._task,
                                            condition: [
                                                ..._task.condition,
                                                { action: null, goals: [] }
                                            ]
                                        }) : ({
                                            ..._task
                                        })
                                    ))
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>

                            <ul className="list">
                                <Query query={GET_ALL_CONDITION_ENUMS} pseudo={{ count: 1, height: 325 }}>
                                    {({ data }) => (
                                        (task.condition.length > 0) ? task.condition.map(condition => (
                                            <li key={condition.id} className="item">
                                                <div className="content">
                                                    <Select options={{
                                                        value: condition.action,
                                                        placeholder: 'Choose action',
                                                        options: data.allEnums.allActions.map(a => ({
                                                            value: a,
                                                            label: a
                                                        })),
                                                        onChange: (e) => {
                                                            setTasks(prev => prev.map(_task =>
                                                                (_task.id === task.id) ? ({
                                                                    ..._task,
                                                                    condition: _task.condition.map(_condition =>
                                                                        (_condition.id === condition.id) ? ({
                                                                            ..._condition,
                                                                            action: e
                                                                        }) : ({
                                                                            ..._condition
                                                                        })
                                                                    )
                                                                }) : ({
                                                                    ..._task
                                                                })    
                                                            ))
                                                        }
                                                    }} />
                                                    <Select options={{
                                                        value: condition.action,
                                                        placeholder: 'Choose goals',
                                                        options: data.allEnums.allGoals.map(a => ({
                                                            value: a,
                                                            label: a
                                                        })),
                                                        closeMenuOnSelect: false,
                                                        isMulti: true,
                                                        onChange: (e) => {
                                                            setTasks(prev => prev.map(_task =>
                                                                (_task.id === task.id) ? ({
                                                                    ..._task,
                                                                    condition: _task.condition.map(_condition =>
                                                                        (_condition.id === condition.id) ? ({
                                                                            ..._condition,
                                                                            goals: e
                                                                        }) : ({
                                                                            ..._condition
                                                                        })
                                                                    )
                                                                }) : ({
                                                                    ..._task
                                                                })    
                                                            ))
                                                        }
                                                    }} />
                                                    {(condition.goals.find(g => g.includes('QUANTITY')) && (
                                                        <Input options={{
                                                            ref: register({ required: 'Multiply is required' }),
                                                            type: 'number',
                                                            name: `[task_${task.id}][condition_${condition.id}][multiply]`,
                                                            placeholder: 'Enter multiply'
                                                        }} />
                                                    ))}
                                                    {(condition.goals.find(g => g.includes('SPECIFIC')) && (
                                                        <React.Fragment>
                                                            <Select options={{
                                                                value: specifics.find(_spec => (_spec.taskId === task.id) && (_spec.condId === condition.id)).area,
                                                                placeholder: 'Choose area',
                                                                options: data.allEnums.allAreas.map(a => ({
                                                                    value: a,
                                                                    label: a
                                                                })),
                                                                onChange: (e) => {
                                                                    setSpecifics(prev => prev.map(_spec =>
                                                                        (_spec.taskId === task.id) && (_spec.condId === condition.id) ? ({
                                                                            ..._spec,
                                                                            area: e
                                                                        }) : ({
                                                                            ..._spec
                                                                        })    
                                                                    ))
                                                                }
                                                            }} />
                                                            {(specifics.find(_spec => (_spec.taskId === task.id) && (_spec.condId === condition.id)).area) && (
                                                                <SpecificSelect
                                                                    task={task}
                                                                    condition={condition}
                                                                    specifics={specifics}
                                                                    setSpecifics={setSpecifics}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    <Checkbox options={{
                                                        state: isComplexCondition,
                                                        list: [
                                                            { id: 0, title: 'Complex condition' }
                                                        ],
                                                        handler: setComplexCondition
                                                    }} />
                                                    {(isComplexCondition) && (
                                                        <Select options={{
                                                            value: condition.union,
                                                            placeholder: 'Choose union',
                                                            options: data.allEnums.allUnions.map(u => ({
                                                                value: u,
                                                                label: u
                                                            })),
                                                            onChange: (e) => {
                                                                setTasks(prev => prev.map(_task =>
                                                                    (_task.id === task.id) ? ({
                                                                        ..._task,
                                                                        condition: _task.condition.map(_condition =>
                                                                            (_condition.id === condition.id) ? ({
                                                                                ..._condition,
                                                                                union: e
                                                                            }) : ({
                                                                                ..._condition
                                                                            })
                                                                        )
                                                                    }) : ({
                                                                        ..._task
                                                                    })    
                                                                ))
                                                            }
                                                        }} />
                                                    )}
                                                    {(isComplexCondition && condition.union) && (
                                                        <Select options={{
                                                            value: condition.link,
                                                            placeholder: 'Choose condition',
                                                            options: task.condition.map(c => ({
                                                                value: c,
                                                                label: c.action
                                                            })),
                                                            onChange: (e) => {
                                                                setTasks(prev => prev.map(_task =>
                                                                    (_task.id === task.id) ? ({
                                                                        ..._task,
                                                                        condition: _task.condition.map(_condition =>
                                                                            (_condition.id === condition.id) ? ({
                                                                                ..._condition,
                                                                                link: e
                                                                            }) : ({
                                                                                ..._condition
                                                                            })
                                                                        )
                                                                    }) : ({
                                                                        ..._task
                                                                    })    
                                                                ))
                                                            }
                                                        }} />
                                                    )}
                                                </div>
                                            </li>
                                        )) : <Message text="No Condition" padding />
                                    )}
                                </Query>
                            </ul>
                        </main>

                        <footer className="awards">
                            <Button options={{
                                state: 'inactive icon',
                                handler: () => {
                                    setTasks(prev => prev.map(_task =>
                                        (_task.id === task.id) ? ({
                                            ..._task,
                                            awards: [
                                                ..._task.awards,
                                                { award: null, quantity: null }
                                            ]
                                        }) : ({
                                            ..._task
                                        })
                                    ))
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>

                            <ul className="list">
                                {(task.awards.length > 0) ? task.awards.map(award => (
                                    <li key={award.id} className="item">
                                        <div className="content">
                                            <Query query={GET_ALL_AWARDS} pseudo={{ count: 1, height: 45 }}>
                                                {({ data }) => (
                                                    <Select options={{
                                                        value: award,
                                                        placeholder: 'Choose award',
                                                        options: data.allAwards.map(p => ({
                                                            value: p,
                                                            label: p
                                                        })),
                                                        onChange: (e) => {
                                                            setTasks(prev => prev.map(_task =>
                                                                (_task.id === task.id) ? ({
                                                                    ..._task,
                                                                    awards: _task.awards.map(_award =>
                                                                        (_award.id === award.id)
                                                                            ? e : _award   
                                                                    )
                                                                }) : ({
                                                                    ..._task
                                                                })    
                                                            ))
                                                        }
                                                    }} />
                                                )}
                                            </Query>
                                            <Input options={{
                                                type: 'number',
                                                value: award.value,
                                                name: `[task_${task.id}][award_${award.id}][value]`,
                                                placeholder: 'Enter number'
                                            }} />
                                        </div>
                                        <div className="manage">
                                            <Button options={{
                                                state: 'inactive icon',
                                                handler: () => {
                                                    setTasks(prev => prev.map(_task =>
                                                        (_task.id === task.id) ? ({
                                                            ..._task,
                                                            awards: _task.awards.filter(_award =>
                                                                (_award.id !== award.id)    
                                                            )
                                                        }) : ({
                                                            ..._task
                                                        })
                                                    ))
                                                }
                                            }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </div>
                                    </li>
                                )) : <Message text="No Awards" padding />}
                            </ul>
                        </footer>
                    </li>
                )) : <Message text="No Tasks" padding />}
            </ul>

            <Button options={{
                type: 'submit',
                state: 'inactive',
                classNames: 'grow'
            }}>
                <p>Save</p>
            </Button>
        </form>
    )
}