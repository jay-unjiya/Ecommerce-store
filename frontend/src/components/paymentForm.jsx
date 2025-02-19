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
    const [errors, setErrors] = useState({});
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
    }, [totalprice, BASE_URL]);

    function showLoader() {
        const button = document.querySelector(".pay-button");
        const loader = document.getElementById("loader");

        // Hide button text and show loader
        button.querySelector("span").style.display = "none";
        loader.style.display = "inline-block";

        setTimeout(() => {
            // Show button text and hide loader after 2 seconds
            button.querySelector("span").style.display = "block";
            loader.style.display = "none";
        }, 2000);
    }

    const validateFields = () => {
        const errors = {};

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (cardNumberElement._empty) {
            errors.cardNumber = "Card number cannot be empty.";
        } else if (!cardNumberElement._complete) {
            errors.cardNumber = "Card number is incomplete.";
        }

        const cardExpiryElement = elements.getElement(CardExpiryElement);
        if (cardExpiryElement._empty) {
            errors.cardExpiry = "Expiration date cannot be empty.";
        } else if (!cardExpiryElement._complete) {
            errors.cardExpiry = "Expiration date is incomplete.";
        }

        const cardCvcElement = elements.getElement(CardCvcElement);
        if (cardCvcElement._empty) {
            errors.cardCvc = "CVV cannot be empty.";
        } else if (!cardCvcElement._complete) {
            errors.cardCvc = "CVV is incomplete.";
        }

        return errors;
    };

    const paymentHandler = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    <div className="field">
                        <label htmlFor="cardExpiry">Expiration Date</label>
                        <CardExpiryElement id="cardExpiry" options={cardStyle} className="input-element" />
                        {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                    </div>
                    <div className="field">
                        <label htmlFor="cardCvc">CVV</label>
                        <CardCvcElement id="cardCvc" options={cardStyle} className="input-element" />
                        {errors.cardCvc && <span className="error-message">{errors.cardCvc}</span>}
                    </div>
                </div>
                <button className="pay-button" type="submit" onClick={showLoader}>
                    <span>Pay ${totalprice}</span>
                    <div className="payment-loader" id="loader"></div>
                </button>
                {errorMsg && <span className="error-message">{errorMsg}</span>}
            </form>
        </div>
    );
};

export default PaymentForm;
