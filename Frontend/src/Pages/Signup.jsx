import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <>
            <div className="flex justify-center my-10  ">
                <div className="flex flex-col justify-center items-center md:flex-row shadow rounded-xl max-w-7xl w-[90%]  m-2">
                    <div className=" w-full md:w-3/4">
                        <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 py-4">

                            <h1 className="font-semibold text-xl md:text-5xl text-gray-600 m-2">Create an Account</h1>


                            <h1 className="text-sm font-medium text-gray-600 m-2">OR</h1>

                        </div>
                        <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
                        <div className="">
                                <input type="email" placeholder="Email Address"
                                    className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-blue-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]" />
                            </div>
                            <div className="">
                                <input type="text" placeholder="Full name"
                                    className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-blue-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]" />
                            </div>
                            <div className="">
                                <input type="password" placeholder="Password"
                                    className=" bg-gray-100 rounded-lg px-5 py-2 focus:border border-blue-600 focus:outline-none text-black placeholder:text-gray-600 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px]" />
                            </div>

                        </div>
                        <div className="text-center mt-7">
                            <button
                                className=" px-24 md:px-[118px] lg:px-[140px] py-2 rounded-md text-white bg-gradient-to-l from-blue-400 to-emerald-400  font-medium m-2 mb-6 ">Sign
                                Up</button>
                        </div>

                    </div>
                    <div
                        className="h-[100%] w-full md:w-1/3  bg-gradient-to-l from-blue-400 to-emerald-400  items-center flex justify-center">

                        <div className="text-white text-base font-semibold text-center my-10 space-y-2 m-2">
                            <h1 className="text-5xl">Already Have an account?</h1>
                            <h1 className="">Login and discover new oppurtinities here</h1>
                            <Link to="/login"> <button className="bg-white rounded-2xl px-4 text-emerald-400 py-1">Login</button> </Link>
                        </div>

                    </div>

                </div>
            </div>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://kit.fontawesome.com/290d4f0eb4.js" crossorigin="anonymous"></script><script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>

            <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
        </>
    )
}

export default Signup
