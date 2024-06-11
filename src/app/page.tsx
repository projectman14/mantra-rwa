"use client";

import About from "@/components/About";
import Aboutbtm from "@/components/Aboutbtm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Working from "@/components/Working";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {

  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  let c2 = "#000000";

  return (
    <div>
      <Hero />
      <Working />
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
       <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        color={color}
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        color={color}
        refresh
      />
      <Particles
        className="z-20"
        quantity={400}
        ease={80}
        color={color}
        refresh
      />
      <FAQ/>
      <About/>
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
      <Aboutbtm/>
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
      <Footer/>
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
