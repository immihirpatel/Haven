import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from "axios";

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDraging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [newArrivals,setNewArrivals] = useState([]);

    useEffect(()=>{
        const fetchNewArrivals = async() =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchNewArrivals()
    },[])

    
    const scroll = (direction)=>{
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({left:scrollAmount, behavior: "smooth"});

    }

    //update scroll buttons
    const updateScrollButtons = ()=>{
        const container = scrollRef.current;
        if(container){
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth +1;
            setCanScrollLeft(leftScroll>0);
            setCanScrollRight(rightScrollable);
        }
         
    }

   

    useEffect(()=>{
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll", updateScrollButtons)
            updateScrollButtons();
            return ()=> container.removeEventListener("scroll",updateScrollButtons);
        }

    },[newArrivals])
 
  return (
   <section className='py-16 px-4 lg:px-0'>
    <div className='container mx-auto text-center mb-16 relative'>
        <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
        <p className='text-lg text-gray-600 mb-8'>
            Discover the latest styles straight off the runway, freshly added to 
            keep your wardrobe on the cutting edge of fashion.
        </p>
        {/* Scroll Button */}
        <div className='absolute right-0 bottom-[-55px] flex space-x-2 '>
            <button onClick={()=>scroll("left")} disabled={!canScrollLeft} className={`p-2 rounded border ${canScrollLeft?
                "bg-white text-black": "bg-gray-200 text-gray-400 cursor-not-allowed" }`}>
                <FiChevronLeft className='text-2xl'/>
            </button>
            <button onClick={()=>scroll("right")} disabled={!canScrollRight}  className={`p-2 rounded border ${canScrollRight?
                "bg-white text-black": "bg-gray-200 text-gray-400 cursor-not-allowed" }`}>
                <FiChevronRight className='text-2xl'/>
            </button>
        </div>
    </div>
    {/* Scrollable Content */}
    <div ref={scrollRef} className='container mx-auto overflow-x-scroll flex space-x-6 relative'>
        
        {newArrivals.map((product)=>(
            
        <div key={product._id} className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'>
                <img className='w-full h-[500px] object-cover rounded-lg'
                src={`${import.meta.env.VITE_BACKEND_URL}${product.images[0]?.url}`} alt={product.images[0]?.altText || product.name}/>
                <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md
                text-white p-4 rounded-bg-lg'>
                    <Link to={`/product/${product._id}`} className="block">
                    <h4 className='font-medium'>{product.name}</h4>
                    <p className='mt-1'>${product.price}</p>
                    </Link>
                </div>
            </div>
        ))}
    </div>
   </section>
  )
}

export default NewArrivals
