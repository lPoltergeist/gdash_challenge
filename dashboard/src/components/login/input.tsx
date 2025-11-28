import React from 'react'
import { Input } from '../ui/input'

const LoginInput = ({ placeholder, ...props }: any) => {
    return <Input
        className="bg-zinc-900 text-zinc-100 border-zinc-700   focus-visible:ring-[rgb(245,209,13)]
    focus-visible:border-[rgb(245,209,13)] my-[10px]"
        placeholder={placeholder}
        {...props}
    />
}

export default LoginInput