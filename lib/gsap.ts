/* GSAP singleton — plugins registered exactly once, imported by client
   components only. SplitText is free since GSAP 3.13, so the signature
   masked letter/line reveals use the real thing. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
