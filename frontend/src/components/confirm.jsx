import React, { useEffect, useState } from 'react'
import img from '../assets/check-symbol.png'
import { useNavigate } from 'react-router-dom'
import '../scss/confirm.scss'
import Footer from './Footer'
const Confirm = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        window.scrollTo(0, 0)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)

        }, 3000)
    }, [])

    return (
       <>
        <div style={{
            display: 'grid', height: '100vh', placeContent: 'center', textAlign: 'center'
        }}>
            {
                loading ? <div className="loader"></div> : <div className='confirm'>
                    <img src={img} alt="" />
                    <h1>Your Order is Confirmed</h1>
                    <button onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            }
        </div>
       </>
    )
}

export default Confirm