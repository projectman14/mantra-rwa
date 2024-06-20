'use client'

import * as React from "react";
import './tablesection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import clock from '../../../public/clock.svg';
import clock2 from '../../../public/clock2.svg';
import Logo from '../../../public/Tokenlandlogo.svg';
import USDC from '../../../public/USDC.svg';
import Image from "next/image";
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";

import { GetLoanDetails, GetRemanigPayment, AcceptLoanPayment } from '../../../ts-codegen/dapp_loan_contract/src/index';
import { GiveLoan, GetLoanContratAddress } from '../../../ts-codegen/dapp_loan_database/src/index';
import { ContractInfo } from '../../../ts-codegen/dapp_loan_contract/src/codegen/LoanContract.types';
import { LoanContract } from '../../../ts-codegen/dapp_loan_database/src/codegen/LoanDatabase.types';
import ShineBorder from "@/components/magicui/shine-border";
import Link from "next/link";

const TableSection = () => {
    const icon: IconProp = faClock;
    const [sender, setSender] = useState("");
    const [allowparams, setAllowparams] = useState(false);
    const [invoices, setInvoices] = useState<ContractInfo[]>([]);
    const [contractArrayCopy, setContractArrayCopy] = useState<LoanContract[]>([]);

    useEffect(() => {
        window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
            console.log("HI HI", keyInfo.bech32Address);
            setAllowparams(true);
            setSender(keyInfo.bech32Address);
        });
    }, []);

    const ReturnArray = async () => {
        try {
            const accessaddress = await GetLoanContratAddress();
            const addressArray = await accessaddress.getLoans({ borrower: sender });

            if (!addressArray || addressArray.length === 0) {
                throw new Error("No contract addresses found or invalid response.");
            }

            return addressArray.contracts;
        } catch (error) {
            console.error("Error fetching contract addresses:", error);
            throw error;
        }
    };

    const GetContractDetailsInObject = async (addresses: string[]) => {
        try {
            const contractObjects = await Promise.all(addresses.map(async (address) => {
                const loandetail = await GetLoanDetails(address);
                return loandetail.getDetails();
            }));

            return contractObjects;
        } catch (error) {
            console.error("Error fetching contract details:", error);
            throw error;
        }
    };

    useEffect(() => {
        ReturnArray()
            .then(async (returnedArray) => {
                try {
                    const contractDetailsArray = await GetContractDetailsInObject(returnedArray.map(obj => obj.address));
                    setContractArrayCopy(returnedArray);
                    setInvoices(contractDetailsArray);
                    console.log(contractDetailsArray);
                } catch (error) {
                    console.error("Error in fetching contract details:", error);
                }
            })
            .catch((error) => {
                console.error("Error in ReturnArray:", error);
            });
    }, [sender , []]);

    const repayAmount = async (contractAddress: string, inputId: string) => {
        const paymentvalueElement = document.getElementById(inputId) as HTMLInputElement;
        const paymentvalue = paymentvalueElement.value;
        const accpayment = await AcceptLoanPayment(contractAddress);
        await accpayment.acceptPayment({ payment: paymentvalue });
        paymentvalueElement.value = ""; // Clear the input field after payment
    };

    return (
        <div className={`bg-[#F6FAFF] tablesection pb-[5rem] flex-col ${invoices.length === 0 ? 'h-[100vh]' : ''}`}>
            <div className="flex m-2 justify-evenly my-2 ml-[7rem]">
                <Image src={Logo} alt="" className="-mt-[0.5px]" />
                <Link href='/'><h3 className='logo text-3xl mt-[2px]'>TokenLand</h3></Link>
                <ShineBorder className="text-center text-sm capitalize h-10 w-36 rounded-2xl z-50" color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                    <p className="text-base">{allowparams ? "Connected" : "Connect Wallet"}</p>
                </ShineBorder>
            </div>
            <div className="flex flex-col tablesection-div ">
                <h1 className="font-extrabold text-black mx-auto text-5xl heading-section-status mt-[5rem] mb-2">Loan Status</h1>
                <h3 className="text-[#545353] font-light mx-auto mb-[3rem]">Check Your Loan Status Here, Repay It and Enjoy</h3>
            </div>
            <div className="flex flex-wrap rounded-xl">
                {invoices.length === 0 ? (
                    <h3 className="text-[#63707D] text-5xl mx-auto mt-10 msg-admin">You have not taken any loan</h3>
                ) : (
                    invoices.map((invoice, index) => (
                        <div key={index} className="h-[26rem] w-[25rem] bg-white ml-[5rem] mt-12 rounded-2xl flex-col px-2">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-black text-lg mx-4 mt-4 font-medium">Amount</h1>
                                    <h3 className="text-[#000000] text-sm mx-5 px-2 font-normal opacity-72">{`$${invoice.borrowed_amount}`}</h3>
                                </div>
                                <div className="flex days-btn rounded-xl mb-1 mt-5 bg-[#0066FF]/[0.2] mr-4">
                                    <Image src={clock} alt="Clock" className="font-medium size-[1.15rem] mt-3 my-auto ml-2" />
                                    <h3 className="text-[#0066FF] mt-2 ml-2 mr-4 font-medium my-auto">
                                        {(() => {
                                            const date1 = new Date(Number(invoice.start_date) / 1e6);
                                            const date2 = new Date(Number(invoice.expiration_date) / 1e6);
                                            const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
                                            const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
                                            return `${differenceInDays.toFixed(0)} days`;
                                        })()}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex justify-between mt-5 ml-3 font-medium">
                                <div className="flex">
                                    <h3 className="text-sm mr-2">Total Loan Paid</h3>
                                    <Image src={clock2} alt="Clock" className="-mt-[1px]" />
                                </div>
                                <div className="mr-6">
                                    <span className="font-medium text-sm">{invoice.currently_paid}</span>
                                    <span className="text-sm text-[#63707D]">/{invoice.borrowed_amount}</span>
                                </div>
                            </div>
                            <Progress value={(Number(invoice.currently_paid) / Number(invoice.borrowed_amount)) * 100} className="ml-[1.75rem] mt-4" />
                            <div className="mt-8 flex-col bg-[#F6FAFF] rounded-2xl text-sm mx-4">
                                <div className="flex justify-between mx-8 my-2 pt-4 text-[#63707D]">
                                    <h3>Start Date</h3>
                                    <h3 className="text-green-400">
                                        {(() => {
                                            const date = new Date(Number(invoice.start_date) / 1e6);
                                            if (isNaN(date.getTime())) return 'Invalid Date';
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}/${month}/${year}`;
                                        })()}
                                    </h3>
                                </div>
                                <div className="flex justify-between mx-8 text-[#63707D] pb-4">
                                    <h3>End Date</h3>
                                    <h3 className="text-red-600">
                                        {(() => {
                                            const date = new Date(Number(invoice.expiration_date) / 1e6);
                                            if (isNaN(date.getTime())) return 'Invalid Date';
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}/${month}/${year}`;
                                        })()}
                                    </h3>
                                </div>
                            </div>
                            <div className="mx-4 rounded-lg border-2 mt-4 h-12 border-[#E8EFFB] bg-[#FCFDFE] flex">
                                <div className="w-[6rem] bg-[#EFF4FC] flex m-1 rounded-lg">
                                    <Image src={USDC} alt="" className="h-6 w-[5rem] mt-2 -ml-4" />
                                    <h3 className="mt-[0.6rem] text-sm font-medium -ml-5">USDC</h3>
                                </div>
                                <input placeholder={invoice.status_code == '0' ?`$${Number(invoice.borrowed_amount) - Number(invoice.currently_paid)} Remaning` : 'Loan Paid Successfully'} className="ml-4 focus:outline-none focus:ring-0" id={`repay_amount_new_${index}`} />
                            </div>
                            <div className="mt-3 mx-4">
                                <button
                                    className={`text-white bg-black rounded-2xl w-[22rem] h-[3rem] ${invoice.status_code === '1' ? 'bg-green-400' : ''}`}
                                    disabled={invoice.status_code === '1'}
                                    onClick={() => repayAmount(contractArrayCopy[index].address, `repay_amount_new_${index}`)}
                                >
                                    {invoice.status_code === '0' ? "Pay Now" : "Loan Completed"}
                                </button>
                            </div>
                            <div className="flex">
                                <p className="text-[#63707D] text-sm mx-auto mt-3">Complete the payment to get back your asset.</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TableSection;
