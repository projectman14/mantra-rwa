'use client'

import React, { useEffect, useState, RefObject } from 'react';
import Navbar from './Navbar';
import Image from 'next/image';
import detaling from '../../public/detail.png'
import ShineBorder from "@/components/magicui/shine-border";
import { useRouter, NextRouter } from 'next/router';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

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


import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { GetLoanDetails, GetRemanigPayment, AcceptLoanPayment } from '../../ts-codegen/dapp_loan_contract/src/index';
import { GiveLoan, GetLoanContratAddress } from '../../ts-codegen/dapp_loan_database/src/index';
import { ContractInfo } from '../../ts-codegen/dapp_loan_contract/src/codegen/LoanContract.types';
import { LoanContract } from '../../ts-codegen/dapp_loan_database/src/codegen/LoanDatabase.types';
import { Key } from 'lucide-react';
import Link from 'next/link';
import { data } from '../../ts-codegen/dapp/src';

interface HeroProps {
  Homeref: RefObject<HTMLDivElement>;
  Workingref: RefObject<HTMLDivElement>;
  Aboutref: RefObject<HTMLDivElement>;
  FAQref: RefObject<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ Homeref, Workingref, Aboutref, FAQref }) => {

  const [allowparams, setAllowparams] = useState(false);
  const [sender, setSender] = useState("");


  useEffect(() => {
    ReturnArray()
      .then(async (returnedArray) => {
        try {
          contractDetailsArray = await GetContractDetailsInObject(returnedArray.map(obj => obj.address));
          // invoices = await GetContractDetailsInObject(returnedArray.map(obj => obj.address));
          setContractArrayCopy(returnedArray)
          setInvoices(contractDetailsArray);
          console.log(contractDetailsArray);
          console.log(contractArrayCopy); // Array of contract detail objects
        } catch (error) {
          console.error("Error in fetching contract details:", error);
        }
      })
      .catch((error) => {
        console.error("Error in ReturnArray:", error);
      });
  }, [sender])

  const handleconnect = () => {
    window.keplr?.enable("mantra-hongbai-1");

    const valueaddr = window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
      console.log("HI HI", keyInfo.bech32Address);
      setAllowparams(true);
      setSender(keyInfo.bech32Address);
      return keyInfo.bech32Address;
    })

  }

  useEffect(() => {
    window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
      console.log("HI HI", keyInfo.bech32Address);
      setAllowparams(true);
      setSender(keyInfo.bech32Address);
      return keyInfo.bech32Address;
    })
  }, [])


  const mnemonic = "fuel grunt humor output offer box bridge hover motor code spoon token have order grief medal sport bulk corn pave market insane access urge"; // Replace with your actual mnemonic

  async function handleclick1() {
    const borrowedAmountElement = document.getElementById("Amount") as HTMLInputElement;
    const borrowedAmountval = borrowedAmountElement.value;
    const tokenUriElement = document.getElementById("Collateral") as HTMLInputElement;
    const tokenUrival = tokenUriElement.value;
    const DaysbeforeElement = document.getElementById("For_how_many_days") as HTMLInputElement;
    const Daysbeforeval = DaysbeforeElement.value;

    alert(borrowedAmountval + tokenUrival + Daysbeforeval);

    const accessloan = await GiveLoan();
    const value1 = accessloan.mintLoanContract({ borrowedAmount: borrowedAmountval, borrower: sender, daysBeforeExpiration: Number(Daysbeforeval), interest: "5", tokenUri: tokenUrival });
    // const value1 = accessloan.mintLoanContract({ borrowedAmount: "78", borrower: "mantra1eqpxy66m8hr4v8njncg68p5melwlgq93kqt5nm", daysBeforeExpiration: 50, interest: "5", tokenUri: "tokenUri" })
    console.log(value1);
    console.log("sucess");
    handleClick();
  }

  async function ReturnArray() {
    try {
      const accessaddress = await GetLoanContratAddress();
      const addressArray = await accessaddress.getLoans({ borrower: sender });

      if (!addressArray || addressArray.length === 0) {
        throw new Error("No contract addresses found or invalid response.");
      }

      const contracts = addressArray.contracts;
      return contracts;
    } catch (error) {
      console.error("Error fetching contract addresses:", error);
      throw error; // Propagate the error further
    }
  }

  async function GetContractDetailsInObject(addresses: string[]) {
    try {
      const contractObjects = await Promise.all(addresses.map(async (address) => {
        const loandetail = await GetLoanDetails(address);
        return loandetail.getDetails();
      }));

      return contractObjects;
    } catch (error) {
      console.error("Error fetching contract details:", error);
      throw error; // Propagate the error further
    }
  }
  let contractDetailsArray: ContractInfo[] = [];
  const [contractArrayCopy, setContractArrayCopy] = useState<LoanContract[]>([]);
  const [invoices, setInvoices] = useState<ContractInfo[]>([])

  // Usage example
  ReturnArray()
    .then(async (returnedArray) => {
      try {
        contractDetailsArray = await GetContractDetailsInObject(returnedArray.map(obj => obj.address));
        // invoices = await GetContractDetailsInObject(returnedArray.map(obj => obj.address));
        setContractArrayCopy(returnedArray)
        setInvoices(contractDetailsArray);
        console.log(contractDetailsArray);
        console.log(contractArrayCopy); // Array of contract detail objects
      } catch (error) {
        console.error("Error in fetching contract details:", error);
      }
    })
    .catch((error) => {
      console.error("Error in ReturnArray:", error);
    });

  async function repayAmount(contractAddress: string) {
    const paymentvalueElement = document.getElementById("repay_amount") as HTMLInputElement;
    const paymentvalue = paymentvalueElement.value;
    const accpayment = await AcceptLoanPayment(contractAddress);
    accpayment.acceptPayment({ payment: paymentvalue });
  }

  async function GetremaningAmount(contractAddressObject: LoanContract) {
    const contractAddress = contractAddressObject.address;
    const rmamount = await GetRemanigPayment(contractAddress);
    const value2 = rmamount.remainingPayment();
    return value2;
  }

  const [remaningAmountArray, setRemaningAmountArray] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const showRemaining = () => {
    let i;
    const length = contractArrayCopy.length;
    for (i = 0; i < length; i++) {
      let pay = GetremaningAmount(contractArrayCopy[i]);
      pay.then((infopay) => {
        setRemaningAmountArray(prevArray => {
          const newArray = [...prevArray, infopay];
          console.log(infopay);
          return newArray;
        });
      });

      setShow(true);
    }
  }





  // handleclick1();
  // console.log("Invoice here",invoices)



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

  const { toast } = useToast();

  const [open, setOpen] = React.useState(false)



  return (
    <div className='Hero mr-16'>
      <div className='coverpage h-96'>
        <div className='p-4'>
          <Navbar handleconnect={handleconnect} status={allowparams} Homeref={Homeref} Workingref={Workingref} Aboutref={Aboutref} FAQref={FAQref} />
        </div>
        <div className='Tagline mt-24'>
          <h1 className='text-5xl font-bold text-white ml-[23rem] !heading-hero'>Welcome to TokenLand - Your Trusted</h1>
          <h1 className='text-5xl font-bold text-white ml-[32rem] mt-3 !heading-hero'>Web3 Lending Platform</h1>
        </div>
        <div>
          <Image src={detaling} alt={''} className='mt-28 h-32 w-[55rem] mx-auto' />
          <div className='flex -mt-28 ml-96'>
            <div className='m-5 mr-32'>
              <h3 className='text-white text-base '>Total Value Locked</h3>
              <h3 className='text-white font-bold text-lg ml-[1rem]'>$605.04M</h3>
            </div>
            <div className='m-5 mr-32'>
              <h3 className='text-white text-base '>Total Market Cap</h3>
              <h3 className='text-white font-bold text-lg ml-[1rem]'>$605.04M</h3>
            </div>
            <div className='m-5 mr-32'>
              <h3 className='text-white text-base '>Total Active User</h3>
              <h3 className='text-white font-bold text-lg ml-[2.25rem]'>60.4M</h3>
            </div>
          </div>
        </div>
        {/*---- Button Special ------ */}
        <div className='flex mt-20 ml-[36rem]'>
          <ShineBorder
            className="text-center align-middle text-base attractuser capitalize h-12 w-40 rounded-2xl mr-12 hover:cursor-pointer mt-6 pt-4"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <Link href='./borrowtoken' className='mt-[1rem]'>Borrow Token</Link>
          </ShineBorder></div>
      </div>

      <div className='bg-white z-50 p-[0.125rem] attractuser rounded-2xl w-40 h-12 mr-12 hover:cursor-pointer ml-[48rem] mt-[13.25rem] relative'>
        <div className='bg-black rounded-xl text-white h-11 hover:cursor-pointer'>
          <p className='text-base ml-4 pt-[0.6rem] hover:cursor-pointer z-50 ' ><Link href='/tablesection' className='text-white'>List Loan Status</Link></p>
        </div>
      </div>

    </div>
  );
}

export default Hero;
function getKey(arg0: string) {
  throw new Error('Function not implemented.');
}

