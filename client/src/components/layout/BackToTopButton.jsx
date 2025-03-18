// src/BackToTopButton.js
import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaChevronUp } from 'react-icons/fa6';
import MessengerBtn from '../shared/MessengerBtn/MessengerBtn';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
        {/* <MessengerBtn/> */}
        <div className='h-12' />
        <button
            onClick={scrollToTop}
            className={`fixed bottom-5 z-20 right-5 bg-primary text-white font-bold w-10 h-10 flex justify-center items-center rounded-full shadow-lg hover:bg-green-600 transition-opacity duration-300 ${isVisible ? 'block' : 'hidden'}`}
        >
            <FaArrowUp/>
        </button>
        </>
    );
};

export default BackToTopButton;
