import React from 'react'
import LoginInput from './input'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { api } from '@/lib/api'

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<any>()


    const onSubmit: SubmitHandler<any> = (data) => {
        api.post('/auth', {
            email: data.email,
            password: data.password
        }).then(
            function (response) {
                console.log(response)
            }
        ).catch(function (error) {
            console.log(error)
        })
    }

    console.log(watch("email"))
    console.log(watch("password"))

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <LoginInput placeholder="email" {...register("email")} />
            <LoginInput placeholder="senha" {...register("password")} />

            <input type="submit" />
        </form>
    )
}

export default Login