import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/queries/get-current-user/getUser';
import { getBanner } from '../lib/queries/get-home-banners/getBanner';


const BASE_URL = 'http://localhost:4000';

export default function Home() {
    const navigate = useNavigate();
    const { data: user } = useQuery({ queryKey: 'user', queryFn: getUser    
    });
    const { data: images } = useQuery({ queryKey: 'imageUrl', queryFn: () => getBanner([1, 2]) });
    const imageUrl1 = images?.[0]?.imageUrl;
    const imageUrl2 = images?.[1]?.imageUrl;
    const signOut = () => {
        localStorage.removeItem('token');        
        navigate('/');
    };
    return (
        <main className="home-body">
            <div className="p-8">
                {user  ?
                    (
                   <> <p>Welcome {user.user.fullName} !</p> 
                        <div className="flex gap-4 justify-between p-6">
                            <button onClick={signOut}> Sign Out! </button> 
                            <Link className="hover:text-blue-600" to="/tasks-page"> Alla Uppdrag </Link>
                        </div>
                   </>
                    ) : (
                    < >
                        <Link className="hover:text-blue-600 p-4" to="/sign-in"> Sign In</Link> eller 
                        <Link className="hover:text-blue-600 p-4" to="/sign-up"> skapa </Link> ett konto så samlar du dina pöeng
                    </>
                )}
            </div>
            <div className="home-container flex h-full gap-5 w-full p-8 bg-orange-200/75">
                <div className=" banner p-[6rem] w-3/4 bg-blue-700/60 border-1 h-[43rem] shadow-2xl border-black flex flex-col rounded-full">
                    <h1 className="text-3xl p-6">Välkommen till Mathems Utbildningsparadis!</h1>
                    <h3 className="text-xl w-full">På <span className="italic">Mathem</span> förstår vi den röriga tillvaron och den ständiga strömmen av nyheter. Mitt i allt detta erbjuder vi dig en fristad – en plats där våra gemensamma värderingar och hemmets kärna firas.</h3>
                    <p className="pl-5 text-md">Här ger vi oss ut på en kunskapsresa som är i linje med våra karriärer på Mathem. Utforska olika aspekter av vår professionella värld genom noggrant utformade utbildningsvägar.</p>
                    <p className="pl-5 text-md">När du navigerar genom vårt webbplatsens korridorer, hoppas vi att du inte bara hittar information, utan också inspiration. Låt oss omdefiniera hemmets betydelse, där värderingar värnas och vikten av en främjande miljö är central.</p>
                    <p>Delta i denna utbildningsresa, där vi vårda både sinnet och karriären, och kom ihåg att även mitt i livets rörlighet kan vi hitta syfte och riktning.</p>
                </div>

                <div className="home-img-box flex flex-col gap-2 h-screen p-8">
                    {imageUrl1 && <img src={`${BASE_URL}/${imageUrl1}`} className='h-[50%] w-full object-cover p-1 rounded-full mt-10' alt='Banner' />}
                    {imageUrl2 && <img src={`${BASE_URL}/${imageUrl2}`} className='home-img-2 h-[50%] w-full object-cover p-1 rounded-full mt-10' alt='Banner' />}
                </div>
            </div>
        </main>
    );
}