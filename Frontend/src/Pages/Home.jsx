import React from 'react'
import Footer from '../components/Footer'
import Product from '../components/Product'
const Home = () => {
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-10 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Codeswear Wear your code</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Codeswear has wide range of codding tshits,hoodies,stickers,hoodies.</p>
          </div>
          <div className="flex flex-wrap -m-4">
            <Product />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Home
