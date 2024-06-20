"use client";

import React from 'react';
import Image from 'next/image';
import underline1 from '../../public/line1.png';
import Lock from '../../public/lockimg.png'
import BorrowToken from '../../public/borrowtoken.png'
import Colatralize from '../../public/colatralize.png'
import Repay from '../../public/repay.png'
import line2 from '../../public/line2.png'


const Working: React.FC = () => {


    return (
        <div className='Working -mt-1'>
            <div className=''>
                <h1 className='Working-heading text-5xl text-white font-bold ml-[36.5rem] p-2 pt-12'>How It Works</h1>
            </div>
            <div className='flex mt-8 ml-[33rem]'>
                <div className='flex flex-col'>
                    <p className='RNDT text-lg'>RNDT Lockers</p>
                </div>
                <p className='Lender ml-[9rem] text-lg'>Lenders & Borrowers</p>
            </div>
            <div>
                <Image src={underline1} alt='' className='ml-[28rem] w-[15rem]' />
            </div>

            {/* Cards for the show */}
            <div className='flex m-24 justify-between p-4'>
                <div className='flex flex-col'>
                    <Image src={Lock} alt='' className='h-[5rem] w-[10rem]' />
                    <p className='font-semibold text-white text-lg m-4'>Connect Wallet</p>
                    <ul className='text-white'>
                        <li className='text-white -ml-16'><p className='text-white text-sm text-center'>Create an Account: Register for a free account <br></br> on TokenLend by providing basic details and<br></br> verifying your identity.</p></li>
                    </ul>
                </div>

                <Image src={line2} alt='' className='-ml-14 -mt-8 h-72 ' />

                <div className='flex flex-col'>
                    <Image src={Repay} alt='' className='h-[5rem] w-[10rem] -ml-2 px-2 py-1' />
                    <p className='font-semibold text-white text-lg m-4 ml-8'>Repay</p>
                    <ul className='text-white'>
                        <li className='text-white -ml-16'><p className='text-white text-sm text-center'>Track Repayments: Use the dashboard <br></br> to monitor your loan status and <br></br> repayment schedule.</p></li>
                    </ul>
                </div>

                <Image src={line2} alt='' className='-ml-14 -mt-8 h-72 ' />

                <div className='flex flex-col'>
                    <Image src={BorrowToken} alt='' className='h-[5rem] w-[10rem] px-2' />
                    <p className='font-semibold text-white text-lg m-4'>Borrow Tokens</p>
                    <ul className='text-white'>
                        <li className='text-white -ml-16'><p className='text-white text-sm text-center'>Specify Loan Details: Enter the amount <br></br> you wish to borrow, the desired interest rate, <br></br>and the repayment period.</p></li>
                    </ul>
                </div>

                <Image src={line2} alt='' className='-ml-14 -mt-8 h-72 ' />

                <div className='flex flex-col'>
                    <Image src={Colatralize} alt='' className='h-[5rem] w-[10rem] px-4 py-2' />
                    <p className='font-semibold text-white text-lg m-4'>Collateralize</p>
                    <ul className='text-white'>
                        <li className='text-white -ml-16'><p className='text-white text-sm text-center'>Choose Collateral: Select the type <br></br> of cryptocurrency you will use as collateral<br></br> (e.g., ETH, BTC, or other supported tokens).</p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Working;
