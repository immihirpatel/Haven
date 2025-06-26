import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollections from '../components/Products/FeaturedCollections'
import FeatureSection from '../components/Products/FeatureSection'
import {useDispatch, useSelector} from 'react-redux'
import { fetchProductByFilters } from '../redux/slices/productSlice'
import axios from 'axios'

const Home = () => {
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector((state)=>state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(()=>{
    //Fetch the product of specific collection
  
    dispatch(fetchProductByFilters({
      gender:"Women",
      category:"Bottom Wear",
      limit:8
    })
  );
  //Fetch best seller product
  const fetchBestSeller = async() =>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
      setBestSellerProduct(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  fetchBestSeller();
  },[dispatch])

  return (
    <div>
      <Hero/>
      <GenderCollectionSection/>
      <NewArrivals/>
      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4 '>Best Seller</h2>
      {bestSellerProduct?
      (<ProductDetails productId={bestSellerProduct._id}/>):
      (<p className='text-center'>Loading best seller products...</p>)}
   
      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4 '>
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollections/>
      <FeatureSection/>
    </div>
  )
}

export default Home
