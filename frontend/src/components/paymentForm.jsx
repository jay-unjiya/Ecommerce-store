import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../scss/paymentForm.scss';
import { useCart } from '../context/CartProvider';

const PaymentForm = ({ totalprice, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { BASE_URL } = useCart();

    useEffect(() => {
        const getClientSecret = async (totalprice) => {
            try {
                const { data } = await axios.post(`${BASE_URL}/payment/create?total=${totalprice * 100}`);
                if (data && data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    throw new Error("Invalid client secret response");
                }
            } catch (error) {
                setErrorMsg(error.message);
                console.log("Failed to retrieve client secret:", error);
            }
        };
        getClientSecret(totalprice);
    }, [totalprice]);

    function showLoader() {
        var button = document.querySelector(".pay-button");
        var loader = document.getElementById("loader");
    
        // Hide button text and show loader
        button.querySelector("span").style.display = "none";
        loader.style.display = "inline-block";
    
        setTimeout(function() {
            // Show button text and hide loader after 2 seconds
            button.querySelector("span").style.display = "block";
            loader.style.display = "none";
        }, 2000);
    }

    const paymentHandler = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            setErrorMsg("Stripe.js has not yet loaded or client secret is missing.");
            return;
        } else {
            setProcessing(true);
            showLoader();
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            })
            .then(({ paymentIntent }) => {
                setErrorMsg("");
                setProcessing(false);
                setSuccess(true);
                showLoader();
                console.log("Payment Successful: ", paymentIntent);
                onSuccess();
                navigate('/confirm');
            })
            .catch((error) => {
                setErrorMsg(error.message);
                setProcessing(false);
                setSuccess(false);
                showLoader(); // Hide loader if payment fails
                console.log("Payment Failed: ", error);
            });
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <div>
            <form onSubmit={paymentHandler} className="payment-form">
                <h2>Payment Details</h2>
                <div className='form-container'>
                    <div className="field field-number">
                        <label htmlFor="cardNumber">Card Number</label>
                        <CardNumberElement id="cardNumber" options={cardStyle} className="input-element" />
                    </div>
                    <div className="field">
                        <label htmlFor="cardExpiry">Expiration Date</label>
                        <CardExpiryElement id="cardExpiry" options={cardStyle} className="input-element" />
                    </div>
                    <div className="field">
                        <label htmlFor="cardCvc">CVV</label>
                        <CardCvcElement id="cardCvc" options={cardStyle} className="input-element" />
                    </div>
                </div>
                <button className="pay-button" type="submit" onClick={showLoader}>
                    <span>Pay ${totalprice}</span>
                    <div className="payment-loader" id="loader"></div>
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
