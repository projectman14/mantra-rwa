"use client";

import React from 'react';
import Image from 'next/image';
import BlurIn from "../components/magicui/blur-in";
import { BorderBeam } from "@/components/magicui/border-beam";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const FAQ: React.FC = () => {

    const { theme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    return (
        <div className='FAQ -mt-[49rem]'>
            <div className='flex '>
                <p className='font-bold text-5xl text-white mx-auto mt-16 italic'>Frequently Asked Questions</p>
            </div>

            <div className='flex flex-col'>
                <BlurIn word={`Find answers to common questions about TokenLend, including how to borrow and lend tokens, the security `} className='text-white text-center m-8 mx-auto' />
                <BlurIn word={`of our platform, and account management. If you have any other queries, our support team is here to help. `} className='text-white text-center m-8 -mt-6 mx-auto' />
            </div>

            <div className='text-white mx-[25rem] rounded-xl relative p-4'>

                <BorderBeam size={300} duration={12} delay={4} />
                <div className='relative z-50'>
                    <Accordion type="single" collapsible className="w-full z-50">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I lend tokens on TokenLend?</AccordionTrigger>
                            <AccordionContent>
                                To lend tokens, create an account, deposit the tokens you wish to lend, and your tokens will be listed for lending. You can earn interest as borrowers use your tokens.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger> What are the benefits of lending tokens on TokenLend?</AccordionTrigger>
                            <AccordionContent>
                                Lenders can earn attractive interest rates on their tokens, contributing to their overall investment returns. Additionally, lending helps support the decentralized finance ecosystem.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger> How is the interest rate determined for lending?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can disable it if you
                                prefer.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger> Can I withdraw my lent tokens before the loan term ends?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can disable it if you
                                prefer.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger> Are there any risks associated with lending tokens?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can disable it if you
                                prefer.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>  What happens if I cannot repay my loan on time?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can disable it if you
                                prefer.
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

            </div>
        </div>
    );
}

export default FAQ;
