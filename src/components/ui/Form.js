import React, { useState } from 'react'
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
    const FormFields = children

    const [action, { loading }] = useMutation(query)
    const [disabledSubmit, setDisabledSubmit] = useState(true)
    const { handleSubmit, register, errors } = useForm()

    const onSubmit = async (form) => {
        const options = beforeEffect(form, variables)
        await action({ variables: options })
        if (afterEffect) afterEffect()
    }

    return (
        <form className={`ui-form${(wide) ? ' wide' : ''}`} onSubmit={handleSubmit(onSubmit)}>
            {<FormFields
                elevate={() => setDisabledSubmit(false)}
                register={register}
                loading={loading}
                errors={errors}
            />}

            <Button options={{
                type: 'submit',
                state: 'inactive',
                disabled: (edit) ? disabledSubmit : false,
                classNames: 'grow'
            }}>
                <p>{(add) ? 'Add' : 'Save Changes'}</p>
            </Button>
        </form>
    )
}