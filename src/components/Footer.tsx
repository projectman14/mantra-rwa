import React from 'react';
import Image from 'next/image';
import facebook from '../../public/facebook.png'
import linkdin from '../../public/instagram.png'
import instagram from '../../public/linkdin.png'
import twitter from '../../public/twitter.png'

const Footer: React.FC = () => {
    return (
        <div className='Footer flex justify-between'>
            <div className='flex flex-col ml-[9rem] mt-12'>
                <h3 className='logo text-4xl'>TokenLAnd</h3>
                <p className='text-white mt-8 text-start font-thin text-sm'>Be a part of the growing TokenLend community. Sign up today <br></br>to start lending or borrowing tokens, and explore the endless <br></br> possibilities of decentralized finance.</p>
                <div className='flex justify-between mt-16'>
                    <Image src={facebook} alt='' className='size-9' />
                    <Image src={linkdin} alt='' className='size-9' />
                    <Image src={instagram} alt='' className='size-9' />
                    <Image src={twitter} alt='' className='size-9' />
                </div>
            </div>
            <div className='flex flex-col mt-12 -ml-[8rem]'>
                <p className='text-white text-xl font-semibold'>Useful Links</p>
                <div className='text-white mt-12 text-sm font-thin flex flex-col justify-between'>
                    <p className='mb-3'>Governance</p>
                    <p className='mb-3'>Security</p>
                    <p className='mb-3'>Doctumentation</p>
                    <p className='mb-3'>FAQ</p>
                </div>
            </div>

            <div className='flex flex-col mt-12 -ml-[8rem] -mr-[5rem]'>
                <p className='text-[#E0E0E0] text-xl font-semibold'>Community</p>
                <div className='text-white mt-12 text-sm font-thin flex flex-col justify-between'>
                    <p className='mb-3'>Help Center</p>
                    <p className='mb-3'>Partners</p>
                    <p className='mb-3'>Suggestion</p>
                    <p className='mb-3'>Blog</p>
                </div>
            </div>

            <div className='flex flex-col mt-12 mr-[10rem]'>
                <p className='text-white text-xl font-semibold'>Join Our Community</p>
                <div className='text-white mt-12 text-sm font-thin flex flex-col justify-between'>
                    <p className='mb-3 text-center'>Joining a community is a wonderful way to<br></br>
                        connect with like-minded individuals, share<br></br>
                        common interests.</p>
                </div>
            </div>

        </div>
    );
}

export default Footer;
