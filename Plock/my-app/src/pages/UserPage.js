import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUser } from '../lib/queries/get-current-user/getUser';
import { Link, useNavigate } from 'react-router-dom';
import { uploadPicture } from '../lib/mutations/upload-profile-picture/upload';

export default function UserPage() {
    const { data: user, isLoading } = useQuery({ queryKey: ['user'], queryFn: getUser });
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [userImageUrl, setUserImageUrl] = useState(null);
    const navigate = useNavigate();
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const mutation = useMutation({
        mutationFn: (newphoto) => uploadPicture({ userImageUrl: newphoto }),
        onSuccess: (data) => {
            console.log(data);
            setShowFileUpload(false);
            setSuccess("Profile picture uploaded successfully.");
            setError('');
        },
        onError: (error) => {
            console.error(error.message);
            setError(error.response?.data?.error || "An error occurred");
            setSuccess('');
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const onFileChange = (event) => {
        setUserImageUrl(event.target.files[0]);
        
    }

    const signOut = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    }

    return (
        <main className="h-screen items-center gap-4">
            <div className="p-6">
                <div className="flex justify-around w-full ">
                    <div className="p-4 flex flex-col gap-4 ">
                        <h1 className="font-semibold text-2xl">User Page</h1>
                        {!showFileUpload ? (
                            <>
                                <img src={`http://localhost:4000/${user.user?.userImageUrl}`} alt="Profile" className="w-[5rem] rounded-full" />
                                <h5 className="text-xs">Ändrar bilden <Link onClick={() => setShowFileUpload(true)}>klick här!</Link></h5>
                                <p className="font-semibold">Välkommen, <br></br>{user.user.fullName}!</p>
                                <label className="font-semibold" htmlFor="email">Email:</label>
                                <p>{user.user.email}</p>
                                <label className="font-semibold" htmlFor="role">Role:</label>
                                <p>{user.user.role}</p>
                                <label className="font-semibold" htmlFor="score">Score:</label>
                                <p>Your score: {user.user.score}</p>
                                <button onClick={signOut} className="p-2 bg-red-500 text-white rounded">Sign Out</button>
                            </>
                        ) : (
                            <div className="p-2 w-[26rem] flex flex-col gap-5 justify-center items-center">
                                <Link onClick={() => setShowFileUpload(false)}>Tillbaka</Link>
                                <img src={`http://localhost:4000/${user.user.userImageUrl}`} alt="Profile" className="w-[5rem] rounded-full" />
                                <input type="file" onChange={onFileChange} className="rounded-full bg-slate-900" aria-label="Upload profile picture" />
                                {error? <p className="p-2 w-full rounded-xl bg-red-500 ">{error}</p>:null}
                                {success? <p className="p-2 w-full rounded-xl bg-green-500 ">{success}</p>:null}
                                <button onClick={() => mutation.mutate(userImageUrl)} className="btn bg-blue-500 text-white rounded p-1">
                                    Upload
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}