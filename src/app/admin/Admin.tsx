'use client'

import * as React from "react";
import './admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import clock from '../../../public/clock.svg';
import clock2 from '../../../public/clock2.svg';
import Logo from '../../../public/Tokenlandlogo.svg';
import Image from "next/image";
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";

import { GetLoanDetails, GetRemanigPayment, AcceptLoanPayment } from '../../../ts-codegen/dapp_loan_contract/src/index';
import { GiveLoan, GetLoanContratAddress } from '../../../ts-codegen/dapp_loan_database/src/index';
import { ContractInfo } from '../../../ts-codegen/dapp_loan_contract/src/codegen/LoanContract.types';
import { LoanContract } from '../../../ts-codegen/dapp_loan_database/src/codegen/LoanDatabase.types';
import ShineBorder from "@/components/magicui/shine-border";

import { fetchData , deleteData } from "@/firebase/firebaseUtils";


interface DataObject {
    sender: string,
    Collatral: string,
    mobnumber: string,
    amount: string,
    days: string
}


const Admin = () => {

    const [admin, setAdmin] = useState("");
    const [allowparams, setAllowparams] = useState(false);

    useEffect(() => {
        window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
            console.log("HI HI", keyInfo.bech32Address);
            setAllowparams(true);
            setAdmin(keyInfo.bech32Address);
            return keyInfo.bech32Address;
        })
    }, [])

    useEffect(() => {
        const loadData = async () => {
          const fetchedData = await fetchData();
          setInvoices(fetchedData);
          console.log(fetchedData);
        };
        loadData();
      }, []);

    const [invoices, setInvoices] = useState<DataObject[]>([]);

    async function handleclick1( borrowedAmountval: string , sender: string , Daysbeforeval: string , tokenUrival: string , id:string) {
        const accessloan = await GiveLoan();
        const value1 = accessloan.mintLoanContract({ borrowedAmount: borrowedAmountval, borrower: sender, daysBeforeExpiration: Number(Daysbeforeval), interest: "5", tokenUri: tokenUrival });
        console.log(value1);
        console.log("sucess");

        handleDelete(id);
      }

      const handleDelete = async (id: string) => {
        await deleteData(id);
        const updatedData = invoices.filter(item => item.id !== id);
        setInvoices(updatedData);
      };

    return (

        <div className="bg-[#F6FAFF] tablesection pb-[5rem] flex-col ">
            <div className="flex m-2 justify-evenly my-2 ml-[7rem]">
                <Image src={Logo} alt="" className="-mt-[0.5px]" />
                <h3 className='logo text-3xl mt-[2px]'>TokenLAnd</h3>

                <ShineBorder
                    className="text-center text-sm capitalize h-10 w-36 rounded-2xl z-50"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                >
                    <p className="text-base">{allowparams ? "Connected" : "Connect Wallet"}</p>
                </ShineBorder>
            </div>
            <div className="flex flex-col tablesection-div ">
                <h1 className="font-extrabold text-black mx-auto text-5xl heading-section-status mt-[5rem] mb-2">Admin Approval</h1>
                <h3 className="text-[#545353] font-light mx-auto mb-[4.5rem]">Loans are approved here by the admin by watching Collateral.</h3>
            </div>
            <div className="flex flex-wrap rounded-xl">
                {invoices.map((invoice, index) => (
                    <div key={index} className="h-[23.5rem] w-[25rem] bg-white ml-[5rem] mt-12 rounded-2xl flex-col px-2">
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <h1 className="text-black text-lg mx-4 mt-4 font-medium">Amount</h1>
                                <h3 className="text-[#000000] text-sm mx-5 px-2 font-normal opacity-72">{`$${invoice.amount}`}</h3>
                            </div>
                            <div className="flex days-btn rounded-xl mb-1 mt-5 bg-[#0066FF]/[0.2] mr-4">
                                <Image src={clock} alt="Clock" className="font-medium size-[1.15rem] mt-3 my-auto ml-2" />
                                <h3 className="text-[#0066FF] mt-2 ml-2 mr-4 font-medium my-auto">{invoice.days} days</h3>
                            </div>
                        </div>
                        <div className="flex-col mt-5 ml-3 font-medium">
                            <div className="flex">
                                <h3 className="text-sm mr-2 text-center ml-[8rem]">Wallet Address</h3>
                            </div>
                            <div className="mr-6 mt-1">
                                <span className="text-sm text-[#63707D]">{invoice.sender}</span>
                            </div>
                        </div>
                        <div className="mt-5 flex-col bg-[#F6FAFF] rounded-2xl text-sm mx-4">
                            <div className="flex-col my-1">
                                <h3 className="text-center pt-3 font-medium text-black ">Collatral Details</h3>
                                <h3 className="text-sm text-[#63707D] text-center py-2">{invoice.Collatral}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 mx-4">
                            <h3 className="text-sm text-black font-medium">Mobile Number</h3>
                            <h3 className="text-sm text-[#63707D] ">{invoice.mobnumber}</h3>
                        </div>
                        <div className="mt-5 mx-4 flex justify-between">
                            <button className="text-white bg-green-600 rounded-2xl w-[10rem] h-[3rem]" onClick={()=>{handleclick1(invoice.amount , invoice.sender , invoice.days , invoice.Collatral , invoice.id)}}>Accept</button>
                            <button className="text-white bg-red-700 rounded-2xl w-[10rem] h-[3rem]" onClick={() =>  {handleDelete(invoice.id)}}>Reject</button>
                        </div>
                        <div className="flex">
                            <p className="text-[#63707D] text-sm mx-auto mt-3">Accept Or Reject Loan According to Collatral</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;
