
import { useForm, type SubmitHandler } from 'react-hook-form'
import { api } from '@/lib/api'

import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router'
import { useEffect, type ChangeEvent } from 'react'
import UseSignInStore from '@/store/validateSignIn'
import { Button } from '@/components/ui/button';
import LoginInput from '@/components/signin/input';
import CustomToastContainer from '@/components/toast/custom-toast';
import z from 'zod';

const SignInSchema = z.object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
})

const SignIn = () => {
    const { email, password, setEmail, setPassword } = UseSignInStore()
    const notify = (msg: string) => toast(msg)
    const navigate = useNavigate()

    const {
        handleSubmit,
    } = useForm<any>()


    const onSubmit: SubmitHandler<any> = () => {
        const validate = SignInSchema.safeParse({
            email,
            password,
        })

        if (!validate.success) {
            const msg = validate.error.issues[0].message
            notify(msg)
            return
        }

        api.post('/auth/login', {
            email: email,
            password: password
        }, {
            withCredentials: true,
        }).then(() => {
            notify("Login realizado com sucesso!");
            navigate('/')
        })
            .catch((error) => {
                const msg =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Credenciais inválidas";
                notify(msg);
            });
    }

    useEffect(() => {
        api.get('/auth/me', { withCredentials: true })
            .then(() => {
                navigate('/', { replace: true });
            })
            .catch(() => {
            });
    }, [navigate]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <LoginInput placeholder="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

            <LoginInput type="password" placeholder="senha"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

            <div className="mt-6">
                <Button type="button" onClick={() => navigate('/signup')}
                    className="mz-4 hover:outline-none hover:ring-2 hover:ring-[#F5D10D]">
                    Sign Up
                </Button>
                <Button
                    type="submit"
                    className="ml-4 !bg-[#F5D10D] !text-black hover:text-white hover:ring-2"
                >
                    Sign In
                </Button>
            </div>

            <CustomToastContainer />
        </form>
    )
}

export default SignIn