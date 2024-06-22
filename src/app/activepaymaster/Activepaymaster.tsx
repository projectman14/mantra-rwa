'use client'

import React,
{ useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ContractInfo } from '../../../ts-codegen/dapp_loan_contract/src/codegen/LoanContract.types';
import { LoanContract } from '../../../ts-codegen/dapp/src/codegen/LoanDatabase.types'
import { GetLoanDetails, GetRemanigPayment, AcceptLoanPayment } from '../../../ts-codegen/dapp_loan_contract/src/index';
import { GiveLoan, GetLoanContratAddress } from '../../../ts-codegen/dapp_loan_database/src/index';
import { GetPaymasterAccountInfo, MakePayMasterAccount } from '../../../ts-codegen/paymasterfactorynew/src/index';
import { GetPayment, SetAutopay } from '../../../ts-codegen/paymaster/src/index';
import Link from 'next/link'




const Activepaymaster = () => {

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
    }, [sender, []]);

    const getNanosecondsTimestamp = () => {
        const now = Date.now(); // Current time in milliseconds since the Unix epoch
        const highResTime = performance.now(); // High-resolution time in milliseconds with microsecond precision
        const highResTimestamp = Math.floor((now * 1e6) + (highResTime * 1e3)); // Convert to nanoseconds
        return highResTimestamp;
    };

    const [addrs , setAddrs] = useState('');
    useEffect(()=>{
        const addr1 = GetPaymasterAccountInfo();
        addr1.then((info2) => {
            const finaladdr = info2.getPaymasterAddress({address:sender});
            finaladdr.then((info3) => {
                setAddrs(info3);
            })
        })
    },[sender])

    async function setautotranx(Contractindex: any) {
        const start_date: string = String(getNanosecondsTimestamp());
        const amountEle = document.getElementById(`repay_amount_new_${Contractindex}`) as HTMLInputElement;
        const frequencyEle = document.getElementById(`frequency_${Contractindex}`) as HTMLInputElement;
        const amountval = amountEle.value;
        const frequencyval = frequencyEle.value;
        const settranx = await SetAutopay(addrs);
        const finalwork = await settranx.addPayment({ amount: amountval, decimals: Number('6'), frequencyInDays: Number(frequencyval), tokenAddress: "mantra1pnh86g85r45er4egge6lhr0svu4nrga4ny7ax06wqgkjq8zgdjtsr7nzve", tokenSymbol: "PBK", receiver: contractArrayCopy[Contractindex].address, startDate: start_date });
        console.log(finalwork);
        frequencyEle.value = '';
        amountEle.value = '';
    }


    return (
        <div className='z-10 w-[100vw]  px-5 xl:px-0 fixed h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 overflow-x-hidden pb-[5rem]'>
            <Link
                href="/paymaster"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mb-5 mt-[2rem] flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
            >
                <p className="text-sm font-semibold text-[#1d9bf0]">
                    TokenLand PayMaster
                </p>
            </Link>
            <h1
                className="animate-fade-up bg-gradient-to-br mt-[2rem] from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] p-2 w-[50rem] mx-auto"
                style={{
                    animationDelay: "0.15s",
                    animationFillMode: "forwards",
                }}
            >
                Setup PayMaster For a Loan
            </h1>
            <div className='w-[80rem] mx-auto mt-[4rem]'>
                <Table className='z-20'>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Amount</TableHead>
                            <TableHead>Loan End Date</TableHead>
                            <TableHead>Amount for Autopay</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Remaning Amount</TableHead>
                            <TableHead className="text-right pr-4">Click To Setup</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{invoice.borrowed_amount}</TableCell>
                                <TableCell>{(() => {
                                    const date = new Date(Number(invoice.expiration_date) / 1e6);
                                    if (isNaN(date.getTime())) return 'Invalid Date';
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}/${month}/${year}`;
                                })()}</TableCell>
                                <TableCell><Input placeholder='Token Amount' className='w-[10rem]' id={`repay_amount_new_${index}`} /></TableCell>
                                <TableCell><Input placeholder='Frequency' className='w-[10rem]' id={`frequency_${index}`} /></TableCell>
                                <TableCell className=' pl-[3.7rem] '>{Number(invoice.borrowed_amount) - Number(invoice.currently_paid)}</TableCell>
                                <TableCell className="text-right"><Button className='w-[6rem]' disabled={invoice.status_code === '1'} onClick={() => { setautotranx(index) }}>{invoice.status_code === '0' ? "Setup Now" : "Paid"}</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Activepaymaster