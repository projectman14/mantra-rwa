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

interface PayMaster {
    paymentId: bigint;
    receiver: string;
    token_symbol: string;
    tokenAddress: string;
    decimals: number;
    amount: bigint;
    frequency_in_days: number;
    next_payment_date: Date;
  }




const Paymasterstatus = () => {

    const [sender, setSender] = useState("");
    const [allowparams, setAllowparams] = useState(false);
    const [invoices, setInvoices] = useState<PayMaster[]>([]);
    const [contractArrayCopy, setContractArrayCopy] = useState<LoanContract[]>([]);
    const [addrs , setAddrs] = useState('');

    useEffect(() => {
        window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
            console.log("HI HI", keyInfo.bech32Address);
            setAllowparams(true);
            setSender(keyInfo.bech32Address);
        });
    }, []);

    async function Getaddrs() {
        console.log(sender+'HEllo')
        const addr1 = await GetPaymasterAccountInfo();
        const watchhow =await addr1.getPaymasterAddress({address : sender });
        console.log(watchhow);
        setAddrs(watchhow);
      }

    useEffect(() => {
        Getaddrs();
    },[sender])

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
                    // setInvoices(contractDetailsArray);
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
        const now = Date.now(); 
        const highResTime = performance.now();
        const highResTimestamp = Math.floor((now * 1e6) + (highResTime * 1e3));
        return highResTimestamp;
    };



    async function getPaymasterstatus() {
        const statuspaymaster = await GetPayment(addrs);
        const valuearray = await statuspaymaster.getPayments();
        console.log(valuearray.payments);
        setInvoices(valuearray.payments);
    }

    useEffect(()=>{
        getPaymasterstatus();
    },[addrs])


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
                Check Your PayMaster List
            </h1>
            <div className='w-[80rem] mx-auto mt-[4rem]'>
                <Table className='z-20'>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Contract Address</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Amount for Autopay</TableHead>
                            <TableHead>Next Payment Date</TableHead>
                            <TableHead>Token Used For Payment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{invoice.receiver}</TableCell>
                                <TableCell>{invoice.frequency_in_days}</TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell> {(() => {
                                    const date = new Date(Number(invoice.next_payment_date) / 1e6);
                                    if (isNaN(date.getTime())) return 'Invalid Date';
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}/${month}/${year}`;
                                })()}</TableCell>
                                <TableCell className=' pl-[3.7rem] '>{invoice.token_symbol}</TableCell>
                                {/* <TableCell className="text-right"><Button className='w-[6rem]' disabled={invoice.status_code === '1'} onClick={() => { setautotranx(index) }}>{invoice.status_code === '0' ? "Setup Now" : "Paid"}</Button></TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Paymasterstatus