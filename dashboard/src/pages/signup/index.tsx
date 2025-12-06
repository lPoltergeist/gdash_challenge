
import { useForm, type SubmitHandler } from 'react-hook-form'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import matchPasswords from '@/helper/matchPasswords'
import { useNavigate } from 'react-router'
import { useEffect, type ChangeEvent } from 'react'
import UseSignUpStore from '@/store/validateSignUp'
import LoginInput from '@/components/signin/input';
import { Button } from '@/components/ui/button';
import CustomToastContainer from '@/components/toast/custom-toast';
import z from 'zod';

const SignUpSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "A confirmação deve ter no mínimo 6 caracteres" }),
})

const SignUp = () => {
    const { email, password, confirmPassword, name, setEmail, setPassword, setConfirmPassword, setName } = UseSignUpStore()
    const notify = (msg: string) => toast(msg)
    const navigate = useNavigate()

    const {
        handleSubmit,
    } = useForm<any>()


    const onSubmit: SubmitHandler<any> = () => {
        const validate = SignUpSchema.safeParse({
            name,
            email,
            password,
            confirmPassword
        })

        if (!validate.success) {
            const msg = validate.error.issues[0].message
            notify(msg)
            return
        }

        if (!matchPasswords(password, confirmPassword)) return notify("As senhas não batem!")

        api.post('/users', {
            name: name,
            email: email,
            password: password
        }, {
            withCredentials: true,
        }).then(() => {
            return api.post('/auth/login', {
                email,
                password
            }, { withCredentials: true });
        }).then(() => {
            navigate("/")
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
            <LoginInput placeholder="nome" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            <LoginInput placeholder="email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            <LoginInput type="password" placeholder="senha" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            <LoginInput type="password" placeholder="confirme a senha" onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />

            <div>
                <Button
                    type="button"
                    onClick={() => navigate('/signin')}
                    className="mr-4 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                >
                    Voltar
                </Button>

                <Button
                    type="submit"
                    className="ml-4 !bg-[#F5D10D] !text-black hover:text-white hover:ring-2"
                >
                    Sign Up
                </Button>

            </div>

            <CustomToastContainer />
        </form>
    )
}

export default SignUp