import React from 'react';
import Image from 'next/image';
import Borderabtm from '../../public/borderabtm.png'
import AboutBottom1 from '../../public/aboutbottom.png'
import Usdc from '../../public/USDC.png'
import Eth from '../../public/ETH.png'
import Bnb from '../../public/BNB.png'
import { BorderBeam } from "@/components/magicui/border-beam";



const Aboutbtm: React.FC = () => {
    return (
        <div className='Aboutbtm flex'>
            <div className='ml-[15.5rem] mt-[9.5rem] flex flex-col'>
                <h1 className='text-white font-bold text-5xl '>0%</h1>
                <h1 className='text-white font-bold text-5xl mt-5'>Industry Loading Rewards</h1>

                <div className='rounded-xl relative '>
                    <Image src={AboutBottom1} alt='' className='h-[9rem] w-[50rem] mt-[5rem] -ml-[5rem]' />
                    <p className='text-white font-thin text-center -ml-[9.5rem] -mt-[6rem]'>Discover the exceptional benefits that set TokenLend apart. Our commitment to superior <br></br> performance, advanced security, and unmatched reliability ensures you get the best out<br></br> of your lending and borrowing experience.</p>
                </div>
            </div>

            <div className='flex flex-col rounded-xl relative'>
                <Image src={Borderabtm} alt='' className='mt-[9.45rem]' />

                <div className='flex -mt-[19rem] ml-7'>
                    <Image src={Usdc} alt='' className='' />
                    <div className='ml-8'>
                        <p className='text-white text-2xl '>USDC</p>
                        <p className='text-white font-bold text-3xl'>0%</p>
                    </div>
                </div>
                <div className=' flex ml-[18rem] -mt-[4.5rem]'>
                    <Image src={Usdc} alt='' className='' />
                    <div className='ml-8'>
                        <p className='text-white text-2xl '>USDC</p>
                        <p className='text-white font-bold text-3xl'>0%</p>
                    </div>
                </div>

                <div className=' flex mt-[5rem] ml-7'>
                    <Image src={Eth} alt='' className='' />
                    <div className='ml-8'>
                        <p className='text-white text-2xl '>ETH</p>
                        <p className='text-white font-bold text-3xl '>0%</p>
                    </div>
                </div>

                <div className=' flex -mt-[4.5rem] ml-[18rem]'>
                    <Image src={Bnb} alt='' className='' />
                    <div className='ml-[2.25rem]'>
                        <p className='text-white text-2xl'>BNB</p>
                        <p className='text-white font-bold text-3xl '>0%</p>
                    </div>
                </div>




            </div>

        </div>
    );
}

export default Aboutbtm;
