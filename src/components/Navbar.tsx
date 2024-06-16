'use client'

import React from 'react';
import { RefObject } from 'react';
import Image from 'next/image';
import ShineBorder from "@/components/magicui/shine-border";
import tokenlogo from "../../public/Tokenlandlogo.svg"

interface NavbarProps {
  handleconnect: () => void;
  status : boolean;
  Homeref: RefObject<HTMLDivElement>;
  Workingref: RefObject<HTMLDivElement>;
  Aboutref: RefObject<HTMLDivElement>;
  FAQref: RefObject<HTMLDivElement>
}


const Navbar: React.FC<NavbarProps> = ({ handleconnect , status , Homeref , Workingref , Aboutref , FAQref }) => {


  // const handleconnect = () => {
  //   window.keplr?.enable("mantra-hongbai-1");

  //   console.log(window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
  //     console.log(keyInfo.bech32Address);
  //   }))
  // }


  return (
    <div className='flex mx-20'>
      <div className='my-auto flex'>
        <Image src={tokenlogo} alt='' className='-mt-2'/>
        <h3 className='logo text-xl -ml-1'>TokenLAnd</h3>
      </div>
      <div className='flex flex-row justify-evenly mx-auto z-50'>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'  onClick={()=>{Homeref.current?.scrollIntoView({behavior:'smooth'})}}>Home</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'  >Borrow Token</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'  onClick={()=>{Aboutref.current?.scrollIntoView({behavior:'smooth'})}}>About Us</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'  onClick={()=>{Workingref.current?.scrollIntoView({behavior:'smooth'})}}>Working</p>
        <p className='text-white mx-5 header-text text-sm my-auto hover:cursor-pointer'  onClick={()=>{FAQref.current?.scrollIntoView({behavior:'smooth'})}}>FAQ</p>
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
        className="text-center text-sm capitalize h-9 w-36 rounded-2xl mr-12 z-50"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <p onClick={handleconnect}>{status ? "Connected" :"Connect Wallet"}</p>
      </ShineBorder>
    </div>
  );
}

export default Navbar;
