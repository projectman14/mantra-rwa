'use client'

import React, { useEffect, useState , RefObject } from 'react';
import Navbar from './Navbar';
import Image from 'next/image';
import detaling from '../../public/detail.png'
import ShineBorder from "@/components/magicui/shine-border";

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
import { data } from '../../ts-codegen/dapp/src';

interface HeroProps {
  Homeref: RefObject<HTMLDivElement>;
  Workingref: RefObject<HTMLDivElement>;
  Aboutref: RefObject<HTMLDivElement>;
  FAQref: RefObject<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({Homeref , Workingref , Aboutref , FAQref}) => {

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
          <h1 className='text-5xl font-bold text-white ml-[23rem]'>Welcome to TokenLand - Your Trusted</h1>
          <h1 className='text-5xl font-bold text-white ml-[32rem] mt-3'>Web3 Lending Platform</h1>
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
              <h3 className='text-white font-bold text-lg ml-[1rem]'>$605.04M</h3>
            </div>
          </div>
        </div>
        {/*---- Button Special ------ */}
        <div className='flex mt-20 ml-[36rem]'>
          <div className='z-50 ' id=''>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild onClick={allowparams ? handleconnect : undefined}>
                <div ><ShineBorder
                  className="text-center text-sm capitalize h-8 w-36 rounded-2xl mr-12 hover:cursor-pointer"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                >
                  Borrow Token
                </ShineBorder></div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-white bg-black ">
                <DialogHeader>
                  <DialogTitle className='text-white'>Loan Information</DialogTitle>
                  <DialogDescription className='text-white font-extralight'>
                    Complete the below inputs to apply for the loan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-white">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Collateral" className="text-right">
                      Collateral
                    </Label>
                    <Input
                      id="Collateral"
                      defaultValue=""
                      placeholder='Describe you Collateral'
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right">
                      Mobile Number
                    </Label>
                    <Input
                      id="number"
                      defaultValue=""
                      className="col-span-3"
                      placeholder='+91756824XXXX'
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="Amount"
                      defaultValue=""
                      className="col-span-3"
                      placeholder='Amount you want to borrow'
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="For_how_many_days" className="text-right">
                      Days
                    </Label>
                    <Input
                      id="For_how_many_days"
                      defaultValue=""
                      className="col-span-3"
                      placeholder='For how many days?'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleclick1}>Apply for loan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {/*  */}

          <Dialog>
            <DialogTrigger asChild>
              <div className='bg-white z-50 p-[0.125rem] rounded-2xl w-36 h-8 mr-12 hover:cursor-pointer'>
                <div className='bg-black rounded-xl text-white h-7 hover:cursor-pointer'>
                  <p className='text-sm ml-4 pt-1 hover:cursor-pointer' onClick={showRemaining}>List Loan Status</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50rem] bg-black text-white">
              <DialogHeader>
                <DialogTitle>Loan Status</DialogTitle>
                <DialogDescription>
                  All the loans that are taken by you are shown here.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Table>
                  <TableCaption>{allowparams ? "" : "Connect wallet to Load Data!!"}</TableCaption>
                  <TableHeader >
                    <TableRow className='!border-[#497de3]'>
                      <TableHead className="w-[100px]">Loan Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Starting Date</TableHead>
                      <TableHead className='text-center'>Ending Date </TableHead>
                      <TableHead className='text-center'>Remaning Payment</TableHead>
                      <TableHead className="">Pay Now</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice, index) => (
                      <TableRow key={invoice.invoice} className='!border-[#497de3]'>
                        <TableCell className="font-medium">{invoice.borrowed_amount}</TableCell>
                        <TableCell>{invoice.status_code}</TableCell>
                        <TableCell>{(() => {
                          // Assume invoice.start_date is in nanoseconds
                          const datedata = Number(invoice.start_date) / 1e6;

                          // Check if datedata is a valid number
                          if (isNaN(datedata)) {
                            return 'Invalid Date';
                          }

                          const data = new Date(datedata);

                          // Check if the date object is valid
                          if (isNaN(data.getTime())) {
                            return 'Invalid Date';
                          }

                          const day = String(data.getDate()).padStart(2, '0');
                          const month = String(data.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                          const year = data.getFullYear();

                          return `${day}/${month}/${year}`;
                        })()}
                        </TableCell>
                        <TableCell className="text-center">{(() => {
                          // Assume invoice.start_date is in nanoseconds
                          const datedata = Number(invoice.expiration_date) / 1e6;

                          // Check if datedata is a valid number
                          if (isNaN(datedata)) {
                            return 'Invalid Date';
                          }

                          const data = new Date(datedata);

                          // Check if the date object is valid
                          if (isNaN(data.getTime())) {
                            return 'Invalid Date';
                          }

                          const day = String(data.getDate()).padStart(2, '0');
                          const month = String(data.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                          const year = data.getFullYear();

                          return `${day}/${month}/${year}`;
                        })()}</TableCell>
                        <TableCell className="text-center text-white">{Number(invoice.borrowed_amount) - Number(invoice.currently_paid)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className='bg-white text-black p-1 rounded-lg w-16'>Pay</button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-black text-white">
                              <DialogHeader>
                                <DialogTitle>Repay Amount Dialog</DialogTitle>
                                {/* <DialogDescription>
                                  Make changes to your profile here. Click save when you're done.
                                </DialogDescription> */}
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Repay Amount
                                  </Label>
                                  <Input
                                    id="repay_amount"
                                    defaultValue=""
                                    className="col-span-3"
                                    placeholder='Enter the amount to repay!'
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={() => { repayAmount((contractArrayCopy[index]).address) }}>Pay Now</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

        </div>

      </div>
    </div >
  );
}

export default Hero;
function getKey(arg0: string) {
  throw new Error('Function not implemented.');
}

