import React, { useState, useRef } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

export default ({
    query,
    wide=false,
    add=false,
    edit=false,
    variables,
    children,
    beforeEffect,
    afterEffect
}) => {
    const formRef = useRef(null)
    const FormFields = children

    const [action, { loading }] = useMutation(query)
    const [disabledSubmit, setDisabledSubmit] = useState(true)

    const { handleSubmit, watch, register, errors, setValue, getValues } = useForm()

    const methods = {
        elevate: () => setDisabledSubmit(false),
        register, loading, errors,
        watch, setValue, getValues
    }

    const onSubmit = async (form) => {
        const vars = beforeEffect(form, variables)
        vars.status = (vars.status) || 'PUBLISHED'

        await action({
            variables: vars
        })

        if (afterEffect) afterEffect()
    }

    return (
        <form ref={formRef} className={`ui-form${(wide) ? ' wide' : ''}`} onSubmit={handleSubmit(onSubmit)}>
            <FormFields {...methods} />

            <Button options={{
                type: 'submit',
                state: 'inactive',
                disabled: !disabledSubmit,
                classNames: 'grow'
            }}>
                <p>{(add) ? 'Add' : 'Save Changes'}</p>
            </Button>
        </form>
    )
}