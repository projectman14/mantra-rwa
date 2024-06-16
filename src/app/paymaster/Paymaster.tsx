'use client'

import { useState, useEffect } from "react";
import Github from "../../../public/github";
import Twitter from "../../../public/twitter";
import { Backpack, Sparkles } from "lucide-react";
import Link from "next/link";
import { GetPaymasterAccountInfo , MakePayMasterAccount } from "../../../ts-codegen/paymasterfactory/src";

export default function Paymaster() {

  const [sender, setSender] = useState("");
  const [addrs, setAddrs] = useState('no');

  useEffect(() => {
    window.keplr?.getKey("mantra-hongbai-1").then((keyInfo) => {
      console.log("HI HI", keyInfo.bech32Address);
      setAllowparams(true);
      setSender(keyInfo.bech32Address);
    });
  }, []);


  useEffect(() => {
    const addr1 = GetPaymasterAccountInfo();
    addr1.then((info2) => {
      const finaladdr = info2.getPaymasterAddress({ address: sender });
      finaladdr.then((info3) => {
        setAddrs(info3);
        console.log(addrs);
      })
    })
  }, [sender])

  async function makeone(){
    (await MakePayMasterAccount(sender)).mintPaymasterAccount();
    setSender(sender);
  }

  return (
    <div className="z-10 w-[100vw]  px-5 xl:px-0 fixed h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mb-5 mt-[10rem] flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
      >
        <p className="text-sm font-semibold text-[#1d9bf0]">
          TokenLand PayMaster
        </p>
      </a>
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem] p-2 w-[50rem] mx-auto"
        style={{
          animationDelay: "0.15s",
          animationFillMode: "forwards",
        }}
      >
        Unleash Your PayMaster on Mantra Blockchain
      </h1>
      <p
        className="mt-6 animate-fade-up text-center text-gray-500 [text-wrap:balance] md:text-xl"
        style={{
          animationDelay: "0.25s",
          animationFillMode: "forwards",
        }}
      >
        Join the global movement with TokenLand PayMaster. Set It and forget about your Payments to be done.
      </p>
      <div
        className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5"
        style={{
          animationDelay: "0.3s",
          animationFillMode: "forwards",
        }}
      >
        <a
          className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
          href="#"
          style={{ display: addrs === 'no' ? 'none' : 'block' }}
        >
          <Sparkles />
          <p className={`${addrs == 'no' ? 'display: none' : ''}`}>PayMaster Status</p>
        </a>
        <Link
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
          href=""
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: addrs === 'no' ? 'none' : 'block' }}
        >
          <Backpack />
          <p className={`${addrs == 'no' ? 'display: none' : ''}`} >Get Me One</p>
        </Link>
        <a
          className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
          href="#"
          style={{ display: addrs != 'no' ? 'none' : 'block' }}
        >
          <p className={''} onClick={makeone}>Firest Setup Paymaster</p>
        </a>

      </div>
    </div>
  );
}

function setAllowparams(arg0: boolean) {
  throw new Error("Function not implemented.");
}
