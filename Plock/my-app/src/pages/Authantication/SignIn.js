import { useState } from 'react';
import { useMutation} from '@tanstack/react-query';
import { PostSignIn } from '../../lib/mutations/auth/postSignIn';
import { useNavigate } from 'react-router-dom';


export default function SignIn() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const mutation = useMutation(
      {  mutationFn: PostSignIn,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            navigate("/");
            window.location.reload();
        },
    });

    return (
        <main className="sign-in-body flex flex-col px-24 py-8 mt-[6rem] mb-[6rem] gap-[2rem]">
            <h2 className="italic text-white gap-6 px-24 py-8 bg-gray-900">Börjar att navegera!</h2>
            <p className="mb-9 p-5"> Är du redo för utveckling?</p>
            {error ?    
                <p className="bg-red-500 text-white p-4 rounded-xl">
                    {error}</p> : null 
            }
            <input value={email} onChange={(e)=> {setEmail(e.target.value)}}  className="border-2 border-gray-200 p-2 rounded-full" placeholder="Email" type="email" />
            <input value={password} onChange={(e)=> {setPassword(e.target.value)}}  className="border-2 border-gray-200 p-2 rounded-full" placeholder="Password" type="password" />
            <button onClick={() => mutation.mutate({ email, password })} className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">Sign in</button>
        </main>
    )
}