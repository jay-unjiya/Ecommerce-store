import React from 'react'
import Carousel from '../components/Carousel'
import ImageSection from '../components/ImageSection'
import CommonRating from '../components/commonRating'
import HomeCollection from '../components/HomeCollection'
import About from '../components/about'
import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../scss/loader.scss'
import Footer from '../components/Footer'

const Home = () => {
 const [loading,setLoading]=useState(false)

    useEffect(()=>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)

        },1000)
    },[])


   
    return (
        <div>
            {loading?(
                <div style={{
                    display:'grid',placeContent:'center',height:'100vh'
                }}>
                     <div className="loader"></div>
                </div>
            ):<><Carousel />
            <ImageSection />
            <CommonRating />
            <HomeCollection />
            <About />
            </>}   
        </div>
    )
}

export default Home
