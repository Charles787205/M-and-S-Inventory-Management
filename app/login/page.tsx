'use client'
import React, { ChangeEvent, useState } from "react";

const Login = () => {

    const [id, setID] = useState('') 
    const [password, setPassword] = useState('')

    const submit = () => {
        fetch('api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                password: password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
        });
    }
    
    return <div className="h-full w-full bg-main-background text-black flex justify-center items-center">
                <div className="w-[350px] h-[338px] bg-custom-white rounded-3xl flex flex-col items-center justify-center pl-6 pr-6 pt-8 pb-8">
                    <h1 className="text-[41px] font-bold mb-[22px]">M&S Company</h1>
                    <input type="text" className="bg-main-background rounded-3xl w-[300px] h-[50px] mb-[22px] pl-4 text-2xl" placeholder="ID" value={id} onChange={e => {setID(e.target.value)}}/>
                    <input type="password" className="bg-main-background rounded-3xl w-[300px] h-[50px] mb-[22px] pl-4 text-2xl" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}}/>
                    <button className="w-[300px] h-[50px] text-custom-white bg-primary-color rounded-3xl font-bold text-[33px]">Login</button>
                </div>
            </div>;
};

export default Login;
