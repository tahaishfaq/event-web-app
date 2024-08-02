// VerifyPayment.js

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { toast, Toaster } from 'sonner';

const VerifyPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            const queryParams = new URLSearchParams(location.search);
            const reference = queryParams.get('reference');
            const eventId = queryParams.get('eventId');
            const userId = queryParams.get('userId');

            try {
                const response = await axiosInstance.get(`/events/verify-payment-callback?reference=${reference}&eventId=${eventId}&userId=${userId}`);
                if (response.data.message === 'Ticket booked successfully') {
                    toast.success('Payment successful! Ticket booked.');
                } else {
                    toast.error('Payment verification failed.');
                }
                navigate(`/single-event/${eventId}`);
            } catch (error) {
                console.error(error);
                toast.error('An error occurred while verifying the payment.');
            }
        };

        verifyPayment();
    }, [location, navigate]);

    return (
        <div>
            <Toaster richColors />
            <h1>Verifying Payment...</h1>
        </div>
    );
};

export default VerifyPayment;