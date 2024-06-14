"use client";

import About from "@/components/About";
import Aboutbtm from "@/components/Aboutbtm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Working from "@/components/Working";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState , useRef} from "react";



export default function Home() {

  const Homeref = useRef<HTMLDivElement | null>(null);
  const FAQref = useRef<HTMLDivElement | null>(null);
  const Aboutref = useRef<HTMLDivElement | null>(null);
  const Workingref = useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  let c2 = "#000000";

  return (
    <div>
      <div ref={Homeref}>
        <Hero Homeref={Homeref} Workingref={Workingref} Aboutref={Aboutref} FAQref={FAQref}/>
      </div>
      <div ref={Workingref}>
        <Working />
      </div>
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
      <div ref={FAQref}>
        <FAQ />
      </div>
      <div ref={Aboutref}>
        <About />
      </div>
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
      <Aboutbtm />
      <Particles
        className="z-20 -mt-[48rem]"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
      <Footer />
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


