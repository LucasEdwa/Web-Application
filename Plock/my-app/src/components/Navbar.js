import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/queries/get-current-user/getUser';



export default function Navbar() {
    const { data: user } = useQuery({ queryKey: ['user'], queryFn: getUser ,});

    return (
        <nav className="nav flex p-8 justify-between bg-slate-900 w-full">
            <h1 className="text-3xl text-white p-2">Mathem P.U.</h1>
            <ul className="flex gap-4 text-white">
                <li><Link to="/">Hem</Link></li>
                {user?.user.id && <li><Link to="/user-page">Medarbetare Page</Link></li>}
            </ul>
        </nav>
    );
}
