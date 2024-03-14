import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer p-1 bg-gray-950 text-white gap-7 bottom-0 w-full rounded-md">
        <div className="w-full flex justify-center gap-5  ">
            <div className=" footer__links flex justify-between p-2 ml-5 items-center w-full">
                <div className="footer__link-wrapper flex gap-5">
                    <div className="footer__link-items flex flex-col w-full">
                        <h2 className="text-lg italic">About Us</h2>
                        <Link to='/sign-up'>How it works</Link>
                        <Link to='/'>Testimonials</Link>
                        <Link to='/'>Careers</Link>
                        <Link to='/'>Investors</Link>
                        <Link to='/'>Terms of Service</Link>
                    </div>
                    <div className="footer__link-items flex flex-col">
                        <h2 className="text-lg italic">Contact Us</h2>
                        <Link to='/'>Contact</Link>
                        <Link to='/'>Support</Link>
                        <Link to='/'>Destinations</Link>
                        <Link to='/'>Sponsorships</Link>
                    </div>
                </div>
                <small className="website-rights">Plock © 2021</small>

                <div className="footer__link-wrapper flex gap-8">
                    <div className="footer__link-items flex flex-col gap-3">
                        <h2 className="text-lg italic">Videos</h2>
                        <Link to='/'>Submit Video</Link>
                        <Link to='/'>Ambassadors</Link>
                        <Link to='/'>Agency</Link>
                        <Link to='/'>Influencer</Link>
                    </div>
                    <div className="footer__link-items flex flex-col gap-3">
                        <h2 className="text-lg italic">Social Media</h2>
                        <Link to='/'>Instagram</Link>
                        <Link to='/'>Facebook</Link>
                        <Link to='/'>Youtube</Link>
                        <Link to='/'>Twitter</Link>
                    </div>
                </div>
            </div>

        </div>
    </footer>
    );
}