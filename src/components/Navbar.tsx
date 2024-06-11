import React from 'react';
import Image from 'next/image';
import ShineBorder from "@/components/magicui/shine-border";


const Navbar: React.FC = () => {
  return (
    <div className='flex mx-20'>
      <div className='my-auto'>
        <h3 className='logo text-xl'>TokenLAnd</h3>
      </div>
      <div className='flex flex-row justify-evenly mx-auto'>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'>Home</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'>Borrow Token</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'>About Us</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'>Working</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'>FAQ</p>
      </div>
      {/* <div className='Button-back rounded-2xl'>
        <button className='bg-black border-white p-1 m-1 text-white rounded-2xl'>Connect</button>
      </div> */}
      {/* <div className='Button-back p-[0.125rem] rounded-2xl w-36 h-8 mr-12 hover:cursor-pointer'>
        <div className='bg-black rounded-xl text-white h-7'>
          <p className='text-sm ml-4  pt-1'>Connect Wallet</p>
        </div>
      </div> */}
      <ShineBorder
        className="text-center text-sm capitalize h-9 w-36 rounded-2xl mr-12 "
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        Connect Wallet
      </ShineBorder>
    </div>
  );
}

export default Navbar;
