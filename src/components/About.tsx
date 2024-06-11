import React from 'react';
import Navbar from './Navbar';
import Image from 'next/image';
import detaling from '../../public/detail.png'
import BetterUptime from '../../public/betteruptime.png'
import BetterUptime2 from '../../public/betteruptime2.png'
import BetterUptime3 from '../../public/betteruptime3.png'
import AboutBottom1 from '../../public/aboutbottom.png'
import Meteors from "@/components/magicui/meteors";

const About: React.FC = () => {



  return (
    <div className='About flex flex-col'>
      <div className='flex '>
        <p className='font-bold text-5xl text-white mx-auto mt-16 italic'>About Us</p>
      </div>

      <div className='flex mt-[3rem] ml-[12rem]'>
        <div className='flex flex-col mx-[7rem]'>
          <Image src={BetterUptime} alt='' className='h-[5rem] w-[5rem]' />
          <p className='text-white mt-4 font-medium italic -ml-4'>Better Uptime</p>
          <p className='text-white -ml-[6.5rem] text-center mt-8 font-light'>Guaranteeing maximum uptime for <br></br>uninterrupted access to our platform, <br></br>ensuring reliability and trust for all users.</p>
        </div>
        <div className='flex flex-col mx-[7rem]'>
          <Image src={BetterUptime2} alt='' className='h-[5rem] w-[5rem]' />
          <p className='text-white mt-4 font-medium italic -ml-4'>Better Uptime</p>
          <p className='text-white -ml-[6.5rem] text-center mt-8 font-light'>Guaranteeing maximum uptime for <br></br>uninterrupted access to our platform, <br></br>ensuring reliability and trust for all users.</p>
        </div>
        <div className='flex flex-col mx-[7rem]'>
          <Image src={BetterUptime3} alt='' className='h-[5rem] w-[5rem]' />
          <p className='text-white mt-4 font-medium italic -ml-4'>Better Uptime</p>
          <p className='text-white -ml-[6.5rem] text-center mt-8 font-light'>Guaranteeing maximum uptime for <br></br>uninterrupted access to our platform, <br></br>ensuring reliability and trust for all users.</p>
        </div>
      </div>

      <div className='flex flex-col -z-2' >
        <Meteors number={30} />
        <Image src={AboutBottom1} alt='' className='h-[8rem] w-[63rem] mx-auto mt-[2rem]' />
        <p className='text-white font-thin -mt-[5.5rem] ml-[1.5rem] text-center '>At TokenLend, we envision a future where decentralized finance is accessible to everyone, providing equal<br></br> opportunities for financial growth and security. Our platform is designed to empower users by offering <br></br> a seamless and secure environment for borrowing and lending digital assets.</p>
      </div>
    </div>
  );
}

export default About;
