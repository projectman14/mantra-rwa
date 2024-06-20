'use client'

import * as React from "react";
import './borrowtoken.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import clock from '../../../public/clock.svg';
import clock2 from '../../../public/clock2.svg';
import Logo from '../../../public/Tokenlandlogo.svg';
import Image from "next/image";
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { GetLoanDetails, GetRemanigPayment, AcceptLoanPayment } from '../../../ts-codegen/dapp_loan_contract/src/index';
import { GiveLoan, GetLoanContratAddress } from '../../../ts-codegen/dapp_loan_database/src/index';
import { ContractInfo } from '../../../ts-codegen/dapp_loan_contract/src/codegen/LoanContract.types';
import { LoanContract } from '../../../ts-codegen/dapp_loan_database/src/codegen/LoanDatabase.types';
import ShineBorder from "@/components/magicui/shine-border";
import exp from '../../../public/exp.png'
import { saveData } from "@/firebase/firebaseUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import confetti from "canvas-confetti";
import Link from "next/link";


interface DataObject {
    sender: string,
    Collatral: string,
    mobnumber: string,
    amount: string,
    days: string
}


const Borrowtoken = () => {

    const [admin, setAdmin] = useState("");
    const [allowparams, setAllowparams] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
            console.log("HI HI", keyInfo.bech32Address);
            setAllowparams(true);
            setAdmin(keyInfo.bech32Address);
            return keyInfo.bech32Address;
        })
    }, [])


    const [invoices, setInvoices] = useState<DataObject[]>([]);

    const toastapperclick = () => {
        toast({
            title: "Loan Applied Successfully ",
            description: "We will connect to you and it will be approved",
            action: (
                <ToastAction altText="Goto schedule to undo" className='bg-black text-white hover:bg-black'>Okay</ToastAction>
            ),
        })
    }

    const handleClick = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
        toastapperclick();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const sender = admin;
        const Collatral = document.getElementById("collatral") as HTMLInputElement;
        const Collatralval = Collatral.value;
        const amount = document.getElementById("amount") as HTMLInputElement;
        const amountval = amount.value;
        const numb = document.getElementById("num") as HTMLInputElement;
        const numbval = numb.value;
        const days = document.getElementById("day") as HTMLInputElement;
        const daysval = days.value;

        const newData: DataObject = {
            sender: sender,
            Collatral: Collatralval,
            mobnumber: numbval,
            amount: amountval,
            days: daysval
        };
        await saveData(newData);
        handleClick();

        Collatral.value = "";
        amount.value = "";
        numb.value = "";
        days.value = "";
    };


    return (
        <div className="bg-[#F6FAFF] tablesection pb-[5rem] flex-col borrowtoken overflow-y-hidden">
            <div className="flex m-2 justify-evenly my-2 ml-[7rem] z-50 ">
                <Image src={Logo} alt="" className="-mt-[0.5px]" />
                <Link href='/'><h3 className='logo text-3xl mt-[2px]'>TokenLAnd</h3></Link>

                <ShineBorder
                    className="text-center text-sm capitalize h-10 w-36 rounded-2xl z-50"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                >
                    <p className="text-base">{allowparams ? "Connected" : "Connect Wallet"}</p>
                </ShineBorder>
            </div>
            <div className="flex flex-col tablesection-div ">
                <h1 className="font-extrabold text-black mx-auto text-5xl heading-section-status mt-[4rem] mb-2">Borrow Token</h1>
                <h3 className="text-[#545353] font-light mx-auto mb-[2rem]">Fill the information below to applay for the Loan</h3>
            </div>
            <div className="flex flex-wrap rounded-sm">
                <form className="mx-auto" >
                    <div className="h-[25.5rem] w-[25rem] bg-white mx-auto mt-2 rounded-2xl flex-col px-2">
                        <div className="flex justify-between ml-6 pt-4 mr-6">
                            <h3 className="font-bold text-xl">Loan Form</h3>
                            <h3 className="font-bold text-xl ">💸</h3>
                        </div>
                        <div className="mx-6 mt-2">
                            <Label className="text-[#545353]">Amount For Loan</Label>
                            <Input placeholder="Amount" className="mt-1" id="amount" />
                        </div>
                        <div className="mx-6 mt-2">
                            <Label className="text-[#545353]">Collatral Description</Label>
                            <Input placeholder="Describe your collatral here" className="mt-1" id="collatral" />
                        </div>
                        <div className="mx-6 mt-2">
                            <Label className="text-[#545353]">For How Many Days</Label>
                            <Input placeholder="Enter the number of days" className="mt-1" id="day" />
                        </div>
                        <div className="mx-6 mt-2">
                            <Label className="text-[#545353]">Mobile Number</Label>
                            <Input placeholder="7568245XXX" className="mt-1" id="num" />
                        </div>
                        <div className="mt-4 ml-6">
                            <button type="submit" className="text-white bg-black rounded-2xl w-[21rem] h-[3rem] z-50 hover:cursor-pointer" onClick={handleSubmit}>Apply For Loan</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="relative -z-50">
                <Image src={exp} alt="" className="-mt-[18rem] -z-50" />
            </div>
        </div>
    );
}

export default Borrowtoken;
