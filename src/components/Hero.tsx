'use client'

import React from 'react';
import Navbar from './Navbar';
import Image from 'next/image';
import detaling from '../../public/detail.png'
import ShineBorder from "@/components/magicui/shine-border";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy } from 'lucide-react';


const Hero: React.FC = () => {



  return (
    <div className='Hero mr-16'>
      <div className='coverpage h-96'>
        <div className='p-4'>
          <Navbar />
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
          {/* <div className='Button-back p-[0.125rem] rounded-2xl w-36 h-8 mr-12 hover:cursor-pointer'>
            <div className='bg-black rounded-xl text-white h-7'>
              <p className='text-sm ml-6 pt-1'>Borrow Token</p>
            </div>
          </div> */}

          {/* <Dialog>
            <DialogTrigger asChild>
              <button className='text-white'>Hello</button>
              <ShineBorder
                className="text-center text-sm capitalize h-8 w-36 rounded-2xl mr-12 hover:cursor-pointer"
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                Borrow Token
              </ShineBorder>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          {/* <Dialog defaultOpen>
            <DialogTrigger asChild>
              <Button variant="outline">Share</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue="https://ui.shadcn.com/docs/installation"
                    readOnly
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          <ShineBorder
            className="text-center text-sm capitalize h-8 w-36 rounded-2xl mr-12 hover:cursor-pointer"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            Borrow Token
          </ShineBorder>
          <div className='bg-white p-[0.125rem] rounded-2xl w-36 h-8 mr-12 hover:cursor-pointer'>
            <div className='bg-black rounded-xl text-white h-7'>
              <p className='text-sm ml-5 pt-1'>Connect Wallet</p>
            </div>
          </div>

        </div>

      </div>
    </div >
  );
}

export default Hero;
