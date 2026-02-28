"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const QUESTION_BANK = [
  { id:"q01", difficulty:1, category:"Malware", question:"What type of malware disguises itself as legitimate software to trick users into installing it?", options:["Worm","Trojan Horse","Ransomware","Adware"], correct:1, explanation:"A Trojan Horse masquerades as harmless software to gain system access." },
  { id:"q02", difficulty:1, category:"Social Engineering", question:"Which attack involves tricking users into revealing sensitive info via fake emails?", options:["Pharming","Spoofing","Phishing","Vishing"], correct:2, explanation:"Phishing uses deceptive emails to lure victims into revealing passwords or personal data." },
  { id:"q03", difficulty:1, category:"Network Security", question:"What does a firewall primarily do?", options:["Encrypts hard drive data","Monitors and filters network traffic","Backs up files","Manages passwords"], correct:1, explanation:"A firewall monitors incoming/outgoing network traffic and blocks unauthorized access." },
  { id:"q04", difficulty:1, category:"Authentication", question:"What does MFA stand for?", options:["Master File Access","Multi-Factor Authentication","Managed Firewall Agent","Manual Form Audit"], correct:1, explanation:"Multi-Factor Authentication requires two or more verification steps before granting access." },
  { id:"q05", difficulty:1, category:"Encryption", question:"Which protocol encrypts web traffic between browser and server?", options:["FTP","SMTP","TLS/SSL","UDP"], correct:2, explanation:"TLS/SSL encrypts HTTP traffic, shown as HTTPS in the browser." },
  { id:"q06", difficulty:2, category:"Vulnerabilities", question:"What is a 'zero-day vulnerability'?", options:["A flaw patched within 24 hours","A flaw known only to the user","An unknown flaw exploited before a patch exists","A firewall misconfiguration"], correct:2, explanation:"A zero-day is unknown to vendors, giving them zero days to fix it before exploitation." },
  { id:"q07", difficulty:2, category:"Network Security", question:"A DDoS attack stands for:", options:["Distributed Denial of Service","Dynamic Domain of Security","Dual Data Overload System","Direct Data on Server"], correct:0, explanation:"DDoS floods a target from many sources, overwhelming it and denying service to legitimate users." },
  { id:"q08", difficulty:2, category:"Encryption", question:"In asymmetric encryption, what encrypts data only the recipient can decrypt?", options:["Private key","Session key","Shared secret","Public key"], correct:3, explanation:"The sender encrypts with the recipient's public key; only their private key decrypts it." },
  { id:"q09", difficulty:2, category:"Malware", question:"Ransomware typically does what after infecting a system?", options:["Deletes all files permanently","Encrypts files and demands payment","Sends spam emails","Records keystrokes silently"], correct:1, explanation:"Ransomware encrypts files and demands cryptocurrency for the decryption key." },
  { id:"q10", difficulty:2, category:"Vulnerabilities", question:"SQL Injection attacks target:", options:["Wi-Fi passwords","Database queries via unsanitized inputs","Browser cookies","Email servers"], correct:1, explanation:"SQL Injection inserts malicious SQL into input fields to manipulate database data." },
  { id:"q11", difficulty:2, category:"Authentication", question:"Which hashing algorithm is considered cryptographically broken?", options:["SHA-256","SHA-3","bcrypt","MD5"], correct:3, explanation:"MD5 is vulnerable to collision attacks and has been broken since the mid-2000s." },
  { id:"q12", difficulty:2, category:"Social Engineering", question:"What is 'pretexting' in social engineering?", options:["Sending malware via text","Creating a fabricated scenario to extract info","Intercepting network packets","Bypassing two-factor authentication"], correct:1, explanation:"Pretexting creates a believable fake scenario to manipulate victims into sharing data." },
  { id:"q13", difficulty:3, category:"Network Security", question:"What does a Man-in-the-Middle attack allow an attacker to do?", options:["Overload a web server","Intercept and alter communications between two parties","Crack password hashes offline","Escalate local privileges"], correct:1, explanation:"A MitM attacker positions themselves between parties to eavesdrop or manipulate data." },
  { id:"q14", difficulty:3, category:"Encryption", question:"What is the primary purpose of a Certificate Authority (CA)?", options:["Generate user passwords","Sign and validate digital certificates to establish trust","Block phishing emails","Store private keys for users"], correct:1, explanation:"A CA issues and signs digital certificates, acting as a trusted third party for identity." },
  { id:"q15", difficulty:3, category:"Vulnerabilities", question:"What is a 'buffer overflow' vulnerability?", options:["Too many simultaneous logins","Writing more data to a buffer than it holds, overwriting adjacent memory","A database running out of storage","Exceeding max HTTP request size"], correct:1, explanation:"A buffer overflow writes beyond allocated memory, potentially allowing arbitrary code execution." },
  { id:"q16", difficulty:3, category:"Forensics", question:"What is the 'chain of custody' in digital forensics?", options:["Encryption applied to forensic data","A blockchain ledger of evidence","Documented record of evidence handling from collection to court","Network path traced during an incident"], correct:2, explanation:"Chain of custody documents all who handled evidence and actions taken, ensuring courtroom integrity." },
  { id:"q17", difficulty:1, category:"Network Security", question:"What does VPN stand for and what is its main purpose?", options:["Virtual Private Network - encrypts internet connections","Verified Packet Node - monitors traffic","Virtual Protocol Namespace - names servers","Variable Port Notation - manages ports"], correct:0, explanation:"A VPN (Virtual Private Network) creates an encrypted tunnel for internet traffic." },
  { id:"q18", difficulty:2, category:"Compliance", question:"GDPR primarily governs:", options:["Government cybersecurity standards","Personal data protection and privacy in the EU","Financial transaction encryption","Open-source software licensing"], correct:1, explanation:"GDPR is the EU law governing how personal data must be handled and protected." },
  { id:"q19", difficulty:3, category:"Authentication", question:"What is the purpose of 'salting' a password before hashing?", options:["Speeds up hashing","Compresses the stored hash","Prevents rainbow table attacks by adding unique random data","Allows reversible decryption"], correct:2, explanation:"A salt adds random data before hashing so identical passwords produce different hashes." },
  { id:"q20", difficulty:3, category:"Malware", question:"A rootkit is most dangerous because it:", options:["Sends millions of spam messages","Steals credit card numbers directly","Conceals itself and other malware at the OS level","Generates bitcoin using CPU resources"], correct:2, explanation:"Rootkits hide deep in the OS, masking malicious activity from security tools." },
];

// ─── PIXEL KNIGHT ─────────────────────────────────────────
function PixelKnight({ state }: { state: string }) {
  const anim = {
    idle:"float 2.8s ease-in-out infinite", hurt:"knightHurt 0.55s ease-out forwards",
    victory:"knightVictory 0.75s ease-out forwards", dead:"knightDead 1.3s ease-out forwards",
    cast:"float 1.4s ease-in-out infinite",
  }[state] ?? "float 2.8s ease-in-out infinite";
  const P = 4;
  const C = { sl:"#eef4fa", sm:"#c8dced", sd:"#8aaccc", sx:"#507a98", tl:"#5ddbb8", tm:"#20c997", td:"#0d9e75", bl:"#74b8f0", bm:"#4a90d9", bd:"#2860a8", sw:"#dcecf8", sh:"#ffffff", gd:"#f0d060", dk:"#1a3040" };
  const r = (x:number, y:number, w:number, h:number, f:string, k?:string) => (
    <rect 
      key={k ?? `${x}-${y}-${w}-${h}-${f}`} 
      x={x*P} 
      y={y*P} 
      width={w*P} 
      height={h*P} 
      fill={f}
    />
  );  return (
    <div style={{animation:anim,transformOrigin:"bottom center",position:"relative",filter:state==="idle"||state==="cast"?"drop-shadow(0 6px 14px rgba(32,120,90,0.22))":"none"}}>
      {state==="cast"&&<div style={{position:"absolute",left:"50%",top:"50%",width:70,height:70,borderRadius:"50%",border:"2px dashed rgba(32,201,151,0.65)",transform:"translate(-50%,-50%)",animation:"castRing 1.2s linear infinite",pointerEvents:"none",boxShadow:"0 0 14px rgba(32,201,151,0.35)"}}/>}
      <svg width={22*P} height={28*P} viewBox={`0 0 ${22*P} ${28*P}`} style={{imageRendering:"pixelated",display:"block"}}>
        <ellipse cx={44} cy={110} rx={26} ry={5} fill="rgba(32,100,80,0.18)"/>
        {/* boots */}
        {r(3,25,5,3,C.sx)}{r(3,24,6,1,C.sd)}{r(4,25,3,1,C.tm)}{r(14,25,5,3,C.sx)}{r(14,24,6,1,C.sd)}{r(15,25,3,1,C.tm)}
        {/* greaves */}
        {r(4,18,4,6,C.sm)}{r(4,18,4,1,C.sl)}{r(7,19,1,5,C.sd)}{r(14,18,4,6,C.sm)}{r(14,18,4,1,C.sl)}{r(17,19,1,5,C.sd)}
        {/* kneecaps */}
        {r(3,17,6,2,C.sd)}{r(4,17,4,1,C.sm)}{r(5,17,2,1,C.tm)}{r(13,17,6,2,C.sd)}{r(14,17,4,1,C.sm)}{r(15,17,2,1,C.tm)}
        {/* tasset */}
        {r(4,15,14,3,C.sd)}{r(5,15,12,2,C.sm)}{r(5,15,12,1,C.sl)}{r(4,16,14,1,C.tm)}
        {/* chest */}
        {r(4,7,14,9,C.sm)}{r(4,7,1,9,C.sd)}{r(17,7,1,9,C.sd)}{r(5,7,12,1,C.sl)}{r(10,7,2,9,C.sd)}{r(11,7,1,9,C.sl)}
        {r(9,10,4,3,C.td)}{r(10,10,2,3,C.tm)}{r(10,11,2,1,C.tl)}{r(5,8,4,1,C.bm)}{r(13,8,4,1,C.bm)}
        {/* pauldrons */}
        {r(1,6,4,5,C.sd)}{r(2,6,3,4,C.sm)}{r(2,6,3,1,C.sl)}{r(1,9,5,1,C.tm)}{r(17,6,4,5,C.sd)}{r(17,6,3,4,C.sm)}{r(17,6,3,1,C.sl)}{r(17,9,5,1,C.tm)}
        {/* left arm */}
        {r(1,11,3,6,C.sm)}{r(1,11,1,6,C.sd)}{r(2,11,2,1,C.sl)}
        {/* shield */}
        {r(0,7,2,10,C.bm)}{r(0,17,3,2,C.bd)}{r(0,7,2,1,C.sl)}{r(0,10,2,1,C.tm)}{r(0,11,2,2,C.gd)}{r(0,12,2,1,C.sl)}
        {/* right arm */}
        {r(18,11,3,6,C.sm)}{r(20,11,1,6,C.sd)}{r(18,11,2,1,C.sl)}
        {/* sword blade */}
        {r(20,0,2,12,C.sw)}{r(20,0,1,11,C.sh)}{r(20,0,2,1,C.sl)}
        {/* crossguard */}
        {r(18,11,6,2,C.sm)}{r(18,11,6,1,C.sl)}{r(18,12,6,1,C.sd)}
        {/* grip */}
        {r(20,13,2,4,C.sx)}{r(20,13,2,1,C.sd)}{r(20,15,2,1,C.sd)}{r(20,17,2,1,C.sd)}
        {/* pommel */}
        {r(19,17,4,2,C.sm)}{r(19,17,4,1,C.sl)}
        {/* teal rune on sword */}
        {r(21,4,1,4,C.tm)}
        {/* helmet */}
        {r(5,1,12,8,C.sm)}{r(5,1,12,1,C.sl)}{r(4,3,2,5,C.sd)}{r(5,3,1,5,C.sm)}{r(16,3,2,5,C.sd)}{r(16,3,1,5,C.sm)}
        {r(6,5,10,3,C.sx)}{r(7,5,8,1,C.tm)}{r(7,6,4,1,C.tl)}{r(13,6,2,1,C.tl)}
        {r(10,5,2,3,C.sd)}{r(11,5,1,2,C.sm)}{r(10,1,2,5,C.sd)}{r(11,1,1,4,C.sl)}
        {r(5,4,1,4,C.tm)}{r(16,4,1,4,C.tm)}{r(6,4,10,1,C.bm)}{r(6,8,10,1,C.bm)}
        {/* plume */}
        {r(9,0,4,2,C.td)}{r(7,0,3,1,C.tm)}{r(6,0,2,1,C.tl)}{r(12,0,3,1,C.tm)}{r(14,0,2,1,C.tl)}{r(10,0,2,1,C.sh)}
        {state==="cast"&&<>{r(1,4,1,1,C.tl,"c1")}{r(20,3,1,1,C.tl,"c2")}{r(0,14,1,1,C.tm,"c3")}{r(21,13,1,1,C.tm,"c4")}</>}
      </svg>
    </div>
  );
}

// ─── HP BAR ────────────────────────────────────────────────
function HPBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = Math.max(0,(hp/maxHp)*100);
  const color = pct>60?"#20c997":pct>30?"#f0a030":"#e05050";
  const isLow = pct<=30;
  return (
    <div style={{background:"rgba(255,255,255,0.88)",border:`1.5px solid ${color}55`,borderRadius:10,padding:"7px 12px",minWidth:190,backdropFilter:"blur(8px)",boxShadow:"0 4px 16px rgba(32,201,151,0.12)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.6rem",letterSpacing:"0.14em",color:"#0d9e75",textTransform:"uppercase"}}>❤ Vitality</span>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.78rem",color,fontWeight:700,animation:isLow&&hp>0?"runeGlow 0.9s ease-in-out infinite":"none"}}>{hp} / {maxHp}</span>
      </div>
      <div style={{height:10,borderRadius:5,background:"rgba(32,201,151,0.12)",border:"1px solid rgba(32,201,151,0.2)",overflow:"hidden",position:"relative"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color}bb,${color})`,borderRadius:5,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1),background 0.5s",boxShadow:`0 0 8px ${color}60`,animation:isLow&&hp>0?"hpPulse 0.8s ease-in-out infinite":"none"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.45) 50%,transparent 100%)",backgroundSize:"200% 100%",animation:"shimmer 1.8s linear infinite"}}/>
      </div>
      <div style={{display:"flex",gap:3,marginTop:4}}>
        {[...Array(4)].map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:hp>=(i+1)*25?color:"rgba(32,201,151,0.15)",transition:"background 0.3s",boxShadow:hp>=(i+1)*25?`0 0 4px ${color}60`:"none"}}/>)}
      </div>
    </div>
  );
}

// ─── BRIGHT ENCHANTED BACKGROUND ──────────────────────────
function EnchantedBG() {
  const clouds=[{w:120,h:38,t:"8%",del:"0s",dur:"28s"},{w:80,h:26,t:"13%",del:"9s",dur:"22s"},{w:155,h:48,t:"5%",del:"16s",dur:"34s"},{w:65,h:22,t:"18%",del:"23s",dur:"19s"}];
  const sparks=Array.from({length:10},(_,i)=>({l:`${9+i*8}%`,t:`${22+Math.sin(i)*28}%`,sz:5+(i%3)*4,del:`${i*0.7}s`}));
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",zIndex:0}}>
      {/* Sky */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#a4e4f8 0%,#c0eee8 28%,#d4f8f0 54%,#e4faf4 75%,#c4f4e4 100%)"}}/>
      {/* Sun */}
      <div style={{position:"absolute",top:22,right:90,width:60,height:60,borderRadius:"50%",background:"radial-gradient(circle at 38% 38%,#fffce0,#f8e050)",boxShadow:"0 0 0 14px rgba(248,224,60,0.2),0 0 0 30px rgba(248,224,60,0.1),0 0 60px rgba(248,224,60,0.28)",animation:"glowPulse 3s ease-in-out infinite"}}/>
      {/* Clouds */}
      {clouds.map((c,i)=>(
        <div key={i} style={{position:"absolute",top:c.t,animation:`cloudFloat ${c.dur} linear infinite`,animationDelay:c.del}}>
          <div style={{width:c.w,height:c.h,background:"rgba(255,255,255,0.93)",borderRadius:c.h*0.6,boxShadow:"0 6px 20px rgba(32,168,200,0.12)",position:"relative"}}>
            <div style={{position:"absolute",top:-c.h*0.33,left:c.w*0.25,width:c.w*0.38,height:c.h*0.7,background:"rgba(255,255,255,0.93)",borderRadius:"50%"}}/>
            <div style={{position:"absolute",top:-c.h*0.22,left:c.w*0.52,width:c.w*0.28,height:c.h*0.55,background:"rgba(255,255,255,0.88)",borderRadius:"50%"}}/>
          </div>
        </div>
      ))}
      {/* Hills */}
      <svg style={{position:"absolute",bottom:"30%",left:0,width:"100%",height:160}} viewBox="0 0 1200 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#78ddb0"/><stop offset="100%" stopColor="#50c890"/></linearGradient>
          <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a4ead0"/><stop offset="100%" stopColor="#84d8b8"/></linearGradient>
        </defs>
        <path d="M0,160 Q150,40 300,80 Q450,120 600,50 Q750,0 900,60 Q1050,110 1200,40 L1200,160 Z" fill="url(#hg1)" opacity="0.5"/>
        <path d="M0,160 Q200,70 400,100 Q600,130 800,70 Q1000,20 1200,80 L1200,160 Z" fill="url(#hg2)" opacity="0.7"/>
      </svg>
      {/* Trees */}
      <svg style={{position:"absolute",bottom:"28%",left:0,width:"100%",height:200}} viewBox="0 0 1200 200" preserveAspectRatio="none">
        {[18,52,90,130].map((x,i)=>(
          <g key={i} transform={`translate(${x},${18+i*6})`} style={{animation:`treeWave ${3+i*0.5}s ease-in-out infinite`,transformOrigin:`${x+12}px 200px`,animationDelay:`${i*0.5}s`}}>
            <rect x={9} y={122} width={6} height={58} fill="#3a7050"/>
            <polygon points="0,122 12,42 24,122" fill={i%2===0?"#54c088":"#3eb878"}/>
            <polygon points="3,97 12,27 21,97" fill={i%2===0?"#6ed0a0":"#58c88e"}/>
            <polygon points="5,74 12,10 19,74" fill="#84dcb0"/>
          </g>
        ))}
        {[1058,1096,1132,1165].map((x,i)=>(
          <g key={i+8} transform={`translate(${x},${14+i*5})`} style={{animation:`treeWave ${3.3+i*0.4}s ease-in-out infinite`,transformOrigin:`${x+12}px 200px`,animationDelay:`${i*0.7}s`}}>
            <rect x={9} y={122} width={6} height={58} fill="#3a7050"/>
            <polygon points="0,122 12,42 24,122" fill={i%2===0?"#46b878":"#54c088"}/>
            <polygon points="3,97 12,27 21,97" fill={i%2===0?"#5ec890":"#6ed0a0"}/>
            <polygon points="5,74 12,10 19,74" fill="#84dcb0"/>
          </g>
        ))}
      </svg>
      {/* Meadow floor */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(0deg,#b0ecd8 0%,#c4f0e0 40%,#d4f8ec 80%,transparent 100%)"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:28,backgroundImage:"repeating-linear-gradient(90deg,transparent 0px,transparent 13px,rgba(80,192,128,0.3) 13px,rgba(80,192,128,0.3) 15px)"}}/>
        {[8,18,28,38,48,58,68,78,88].map((p,i)=>(
          <div key={i} style={{position:"absolute",left:`${p}%`,top:-6,fontSize:i%3===0?"14px":"10px",animation:`glowPulse ${2+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}>
            {["🌸","🌼","💐","🌺","🌷"][i%5]}
          </div>
        ))}
      </div>
      {/* Pond */}
      <div style={{position:"absolute",bottom:"13%",left:"14%",width:175,height:38,background:"linear-gradient(180deg,rgba(80,205,240,0.65) 0%,rgba(30,175,215,0.45) 100%)",borderRadius:"50%",boxShadow:"0 4px 18px rgba(30,168,215,0.28),inset 0 2px 8px rgba(255,255,255,0.38)",animation:"waterShimmer 2.5s ease-in-out infinite"}}>
        <div style={{position:"absolute",top:"28%",left:"10%",right:"10%",height:2,background:"rgba(255,255,255,0.55)",borderRadius:2,transform:"skewX(-20deg)"}}/>
      </div>
      {/* Sparkles */}
      {sparks.map((s,i)=>(
        <div key={i} style={{position:"absolute",left:s.l,top:s.t,width:s.sz,height:s.sz,pointerEvents:"none"}}>
          <div style={{width:"100%",height:"100%",background:i%3===0?"rgba(32,201,151,0.75)":i%3===1?"rgba(74,144,217,0.75)":"rgba(86,194,136,0.75)",borderRadius:i%2===0?"50%":"30% 70% 70% 30%",animation:`glowPulse ${2+i*0.3}s ease-in-out infinite`,animationDelay:s.del,boxShadow:"0 0 8px currentColor"}}/>
        </div>
      ))}
      {/* Castle */}
      <svg style={{position:"absolute",bottom:"29%",right:"7%",width:118,height:128,opacity:0.72}} viewBox="0 0 118 128">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#cceee0"/><stop offset="100%" stopColor="#9cd4bc"/></linearGradient></defs>
        <rect x="38" y="28" width="42" height="100" fill="url(#cg)"/>
        <rect x="8" y="48" width="32" height="80" fill="url(#cg)"/>
        <rect x="78" y="42" width="32" height="86" fill="url(#cg)"/>
        {[38,48,58,68].map(x=><rect key={x} x={x} y={18} width={9} height={12} fill="url(#cg)"/>)}
        {[8,19].map(x=><rect key={x} x={x} y={38} width={8} height={12} fill="url(#cg)"/>)}
        {[78,89,100].map(x=><rect key={x} x={x} y={32} width={8} height={12} fill="url(#cg)"/>)}
        <rect x="50" y="53" width="18" height="24" fill="#50ccec" opacity="0.65" rx="9"/>
        <rect x="14" y="68" width="14" height="18" fill="#50ccec" opacity="0.55" rx="7"/>
        <rect x="88" y="62" width="14" height="18" fill="#50ccec" opacity="0.55" rx="7"/>
        <path d="M50 128 L50 98 Q59 88 68 98 L68 128 Z" fill="#a8e0cc"/>
        <line x1="59" y1="18" x2="59" y2="0" stroke="#5ab8a0" strokeWidth="1.5"/>
        <polygon points="59,0 74,5 59,10" fill="#20c997"/>
      </svg>
      {/* Butterflies */}
      {[{l:"26%",t:"42%",c:"#20c997"},{l:"68%",t:"56%",c:"#4a90d9"},{l:"49%",t:"36%",c:"#56c288"}].map((b,i)=>(
        <div key={i} style={{position:"absolute",left:b.l,top:b.t,fontSize:13,animation:`glowPulse ${2+i}s ease-in-out infinite`,animationDelay:`${i*1.1}s`,filter:`drop-shadow(0 0 4px ${b.c})`,pointerEvents:"none"}}>🦋</div>
      ))}
      {/* Vignette */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 55%,rgba(100,180,160,0.1) 100%)",pointerEvents:"none"}}/>
    </div>
  );
}

// ─── CATEGORY BADGE ───────────────────────────────────────
const CAT_COLORS: Record<string, {bg:string;b:string;t:string}>={"Malware":{bg:"#fff0f0",b:"#e08080",t:"#c03030"},"Encryption":{bg:"#f0f4ff",b:"#7090e0",t:"#3050c0"},"Network Security":{bg:"#f0fff8",b:"#40c088",t:"#1a8050"},"Authentication":{bg:"#fffaf0",b:"#d0a030",t:"#a07010"},"Social Engineering":{bg:"#f8f0ff",b:"#a060d0",t:"#7030b0"},"Vulnerabilities":{bg:"#fffce8",b:"#c0b020",t:"#806000"},"Compliance":{bg:"#f0fffe",b:"#30b0b0",t:"#107070"},"Forensics":{bg:"#fff6f0",b:"#c08060",t:"#804030"}};
function CategoryBadge({category}:{category:string}){const s=CAT_COLORS[category]||{bg:"#f0f0f0",b:"#aaa",t:"#555"};return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,border:`1.5px solid ${s.b}`,background:s.bg,color:s.t,fontSize:"0.62rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700}}>{category}</span>;}

// ─── DIFFICULTY STARS ─────────────────────────────────────
function DifficultyStars({difficulty}:{difficulty:number}){return <div style={{display:"flex",gap:2,alignItems:"center"}}>{[1,2,3].map(i=><span key={i} style={{fontSize:"0.78rem",color:i<=difficulty?"#20c997":"rgba(32,201,151,0.2)",filter:i<=difficulty?"drop-shadow(0 0 3px rgba(32,201,151,0.6))":"none",transition:"all 0.2s"}}>✦</span>)}</div>;}

// ─── OPTION BUTTON ────────────────────────────────────────
function OptionButton({label,index,letter,state,onClick,disabled}:{label:string;index:number;letter:string;state:string;onClick:()=>void;disabled?:boolean}){
  const isR=state==="removed",isC=state==="correct",isW=state==="wrong",isD=state==="disabled"||disabled;
  const brd=isC?"#20c997":isW?"#e05050":"rgba(32,201,151,0.28)";
  const bg=isC?"rgba(32,201,151,0.11)":isW?"rgba(224,80,80,0.09)":"rgba(255,255,255,0.88)";
  const sh=isC?"0 0 16px rgba(32,201,151,0.3),0 4px 14px rgba(0,0,0,0.05)":isW?"0 0 16px rgba(224,80,80,0.28),0 4px 14px rgba(0,0,0,0.05)":"0 2px 10px rgba(32,100,80,0.07)";
  return (
    <div style={{overflow:"hidden",borderRadius:10,animation:isR?"optionRemove 0.4s ease-out forwards":"none"}}>
      <button onClick={onClick} disabled={isD??isR} style={{width:"100%",padding:"11px 15px",display:"flex",alignItems:"center",gap:12,background:bg,border:`1.5px solid ${brd}`,borderRadius:10,cursor:isD||isR?"not-allowed":"pointer",color:isR?"transparent":isC?"#0d7a58":isW?"#b03030":"#1a3a30",fontFamily:"'Nunito',sans-serif",fontSize:"1rem",textAlign:"left",transition:"all 0.17s",backdropFilter:"blur(6px)",boxShadow:sh,fontWeight:600}}
        onMouseEnter={e=>{if(!isD&&!isR&&state==="idle"){e.currentTarget.style.borderColor="#20c997";e.currentTarget.style.background="rgba(32,201,151,0.08)";e.currentTarget.style.transform="translateX(5px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(32,201,151,0.2)";}}}
        onMouseLeave={e=>{if(!isD&&!isR&&state==="idle"){e.currentTarget.style.borderColor="rgba(32,201,151,0.28)";e.currentTarget.style.background="rgba(255,255,255,0.88)";e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(32,100,80,0.07)";}}}
      >
        <span style={{minWidth:28,height:28,borderRadius:6,background:isC?"rgba(32,201,151,0.16)":isW?"rgba(224,80,80,0.13)":"rgba(32,201,151,0.09)",border:`1.5px solid ${isC?"#20c997":isW?"#e05050":"rgba(32,201,151,0.32)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:"0.78rem",fontWeight:700,color:isC?"#0d9e75":isW?"#c03030":"#20c997",flexShrink:0}}>
          {isC?"✓":isW?"✗":letter}
        </span>
        <span style={{flex:1}}>{label}</span>
        {state==="idle"&&!isD&&<span style={{color:"rgba(32,201,151,0.45)",fontSize:"1rem"}}>›</span>}
      </button>
    </div>
  );
}

// ─── SCORE PANEL ──────────────────────────────────────────
function ScorePanel({score,streak,level}:{score:number;streak:number;level:number}){
  return (
    <div style={{display:"flex",gap:12,alignItems:"center",background:"rgba(255,255,255,0.84)",border:"1.5px solid rgba(32,201,151,0.28)",borderRadius:12,padding:"7px 16px",backdropFilter:"blur(8px)",boxShadow:"0 4px 16px rgba(32,201,151,0.1),0 2px 6px rgba(0,0,0,0.06)"}}>
      {[{label:"LEVEL",value:level,color:"#20c997"},{label:"SCORE",value:score,color:"#1a3a30"}].map(({label,value,color},i)=>(
        <div key={i} style={{textAlign:"center"}}>
          <div style={{fontSize:"0.52rem",color:"#0d9e75",letterSpacing:"0.2em",fontFamily:"'Cinzel',serif"}}>{label}</div>
          <div style={{fontSize:"1.05rem",fontWeight:800,color,fontFamily:"'Cinzel',serif",lineHeight:1.1}}>{value}</div>
        </div>
      ))}
      {streak>=2&&<><div style={{width:1,height:28,background:"rgba(32,201,151,0.2)"}}/><div style={{textAlign:"center"}}><div style={{fontSize:"0.52rem",color:"#d08010",letterSpacing:"0.2em",fontFamily:"'Cinzel',serif"}}>STREAK</div><div style={{fontSize:"1.05rem",fontWeight:800,color:"#e8a020",fontFamily:"'Cinzel',serif",lineHeight:1.1,animation:"runeGlow 0.8s ease-in-out infinite"}}>🔥{streak}x</div></div></>}
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────
function IntroScreen({onStart}:{onStart:()=>void}){
  return (
    <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{textAlign:"center",animation:"introReveal 1s ease-out forwards",padding:"0 24px"}}>
        <div style={{fontSize:"0.72rem",letterSpacing:"0.45em",color:"#0d9e75",textTransform:"uppercase",marginBottom:10,fontFamily:"'Cinzel',serif",opacity:0.8}}>✦ The Enchanted Realm ✦</div>
        <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:"clamp(2.4rem,8vw,4.6rem)",lineHeight:1.05,background:"linear-gradient(135deg,#20c997 0%,#17a8c8 45%,#4a90d9 80%,#20c997 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 2px 10px rgba(32,201,151,0.32))",marginBottom:2}}>CYBER</h1>
        <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:"clamp(2.4rem,8vw,4.6rem)",lineHeight:1.05,background:"linear-gradient(135deg,#4a90d9 0%,#20c997 55%,#56c288 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 2px 10px rgba(74,144,217,0.32))",marginBottom:18}}>QUEST</h1>
        <div style={{display:"flex",justifyContent:"center",marginBottom:18,animation:"float 2.8s ease-in-out infinite"}}><PixelKnight state="cast"/></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18}}>
          <div style={{width:55,height:1.5,background:"linear-gradient(90deg,transparent,#20c997)"}}/>
          <span style={{color:"#20c997",fontSize:"1.05rem",animation:"runeGlow 2s ease-in-out infinite"}}>⚔</span>
          <div style={{width:55,height:1.5,background:"linear-gradient(270deg,transparent,#20c997)"}}/>
        </div>
        <p style={{fontFamily:"'Crimson Text',serif",fontStyle:"italic",fontSize:"clamp(0.9rem,2.4vw,1.08rem)",color:"#2a5a48",maxWidth:490,lineHeight:1.7,margin:"0 auto 6px"}}>
          "The enchanted realm faces dark threats — wielding exploits and digital curses. Only a silver knight versed in cybersecurity lore can defend it."
        </p>
        <p style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",color:"#7ab0a0",maxWidth:440,lineHeight:1.6,margin:"0 auto 24px"}}>
          Answer questions to gain power. Wrong answers drain your Vitality. How long can you stand against the darkness?
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
          {[{icon:"✦",text:"Correct = Score + Streak",c:"#0d9e75",bg:"rgba(32,201,151,0.09)"},{icon:"✗",text:"Wrong = −25 HP, option removed",c:"#c03030",bg:"rgba(224,80,80,0.07)"},{icon:"❤",text:"Start with 100 Vitality",c:"#c04060",bg:"rgba(192,64,96,0.07)"}].map(({icon,text,c,bg})=>(
            <div key={text} style={{display:"flex",alignItems:"center",gap:7,background:bg,border:`1px solid ${c}33`,borderRadius:20,padding:"6px 13px",backdropFilter:"blur(4px)"}}>
              <span style={{color:c,fontSize:"0.82rem"}}>{icon}</span>
              <span style={{fontFamily:"'Nunito',sans-serif",color:"#1a3a30",fontSize:"0.83rem",fontWeight:600}}>{text}</span>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={{fontFamily:"'Cinzel',serif",fontSize:"0.92rem",fontWeight:700,letterSpacing:"0.18em",color:"white",textTransform:"uppercase",background:"linear-gradient(135deg,#20c997,#17a8c8,#4a90d9)",border:"none",borderRadius:28,padding:"13px 50px",cursor:"pointer",boxShadow:"0 6px 28px rgba(32,201,151,0.38),0 2px 8px rgba(0,0,0,0.08)",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.boxShadow="0 10px 38px rgba(32,201,151,0.52)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 6px 28px rgba(32,201,151,0.38),0 2px 8px rgba(0,0,0,0.08)";}}>
          ⚔ Begin the Quest
        </button>
      </div>
    </div>
  );
}

// ─── GAME OVER ────────────────────────────────────────────
function GameOverScreen({score,streak,questionsAnswered,cause,onRestart}:{score:number;streak:number;questionsAnswered:number;cause:string;onRestart:()=>void}){
  const isD=cause==="hp";
  return (
    <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(184,240,224,0.55)",backdropFilter:"blur(12px)",animation:"introReveal 0.4s ease-out"}}>
      <div style={{background:"rgba(255,255,255,0.96)",border:`2px solid ${isD?"#e08080":"#20c997"}`,borderRadius:20,padding:"38px 46px",textAlign:"center",maxWidth:450,boxShadow:"0 20px 60px rgba(32,100,80,0.18),0 4px 18px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:"3.2rem",marginBottom:8}}>{isD?"💀":"🏳️"}</div>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:"1.7rem",fontWeight:900,color:isD?"#c03030":"#20c997",marginBottom:6,filter:`drop-shadow(0 0 8px ${isD?"rgba(192,48,48,0.25)":"rgba(32,201,151,0.25)"})`}}>
          {isD?"FALLEN IN BATTLE":"RETREAT TAKEN"}
        </h2>
        <p style={{fontFamily:"'Crimson Text',serif",fontStyle:"italic",color:"#7ab0a0",fontSize:"0.98rem",marginBottom:26}}>
          {isD?'"The knight rests... but the knowledge endures."':'"Sometimes wisdom knows when to pause."'}
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
          {[{label:"Final Score",value:score,icon:"✦",color:"#20c997"},{label:"Best Streak",value:`${streak}x`,icon:"🔥",color:"#e8a020"},{label:"Answered",value:questionsAnswered,icon:"📜",color:"#17a8c8"}].map(({label,value,icon,color})=>(
            <div key={label} style={{background:"rgba(32,201,151,0.06)",border:"1.5px solid rgba(32,201,151,0.18)",borderRadius:12,padding:"13px 6px"}}>
              <div style={{fontSize:"1.35rem",marginBottom:3}}>{icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.15rem",fontWeight:700,color}}>{value}</div>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",color:"#7ab0a0",marginTop:2,fontWeight:600}}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onRestart} style={{fontFamily:"'Cinzel',serif",fontSize:"0.88rem",fontWeight:700,letterSpacing:"0.14em",color:"white",textTransform:"uppercase",background:"linear-gradient(135deg,#20c997,#4a90d9)",border:"none",borderRadius:24,padding:"11px 38px",cursor:"pointer",boxShadow:"0 6px 20px rgba(32,201,151,0.32)"}}>
          ↺ Rise Again
        </button>
      </div>
    </div>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────
const MAX_HP=100, HP_PENALTY=25, SCORE_BASE=100;

type Question={id:string;difficulty:number;category:string;question:string;options:string[];correct:number;explanation:string;desc?:string;};

export default function CyberQuest(){
  const [phase,setPhase]=useState<string>("intro");
  const [gameOverCause,setGameOverCause]=useState<string>("hp");
  const [hp,setHp]=useState<number>(MAX_HP);
  const [score,setScore]=useState<number>(0);
  const [streak,setStreak]=useState<number>(0);
  const [bestStreak,setBestStreak]=useState<number>(0);
  const [level,setLevel]=useState<number>(1);
  const [qAnswered,setQAnswered]=useState<number>(0);
  const [currentQ,setCurrentQ]=useState<Question|null>(null);
  const [optStates,setOptStates]=useState<string[]>(["idle","idle","idle","idle"]);
  const [answered,setAnswered]=useState<boolean>(false);
  const [aiLoading,setAiLoading]=useState<boolean>(false);
  const [showExpl,setShowExpl]=useState<boolean>(false);
  const [knightState,setKnightState]=useState<string>("idle");
  const [dmgFlash,setDmgFlash]=useState<boolean>(false);
  const [dmgNum,setDmgNum]=useState<string|null>(null);
  const usedIds=useRef(new Set());
  const timer=useRef<NodeJS.Timeout|null>(null);

  const fetchAI=useCallback(async(diff:number)=>{
    try{setAiLoading(true);const res=await fetch("/api/question",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({difficulty:diff,usedIds:[...usedIds.current]})});const data=await res.json();if(data.ok&&data.question)return data.question;}catch(e){console.warn("AI fail",e);}finally{setAiLoading(false);}return null;
  },[]);

  const getNext=useCallback(async()=>{
    const diff=Math.min(3,Math.ceil(level/3));
    if(qAnswered%2===1){const aiQ=await fetchAI(diff);if(aiQ&&!usedIds.current.has(aiQ.id)){usedIds.current.add(aiQ.id);return aiQ;}}
    let pool=QUESTION_BANK.filter(q=>!usedIds.current.has(q.id)&&q.difficulty<=diff);
    if(!pool.length)pool=QUESTION_BANK.filter(q=>!usedIds.current.has(q.id));
    if(!pool.length){usedIds.current.clear();pool=[...QUESTION_BANK];}
    const q=pool[Math.floor(Math.random()*pool.length)];
    if(!q)return null;
    usedIds.current.add(q.id);
    const correct=q.options[q.correct];
    const shuffled=[...q.options].sort(()=>Math.random()-0.5);
    return {...q,options:shuffled,correct:shuffled.indexOf(correct??"")};
  },[level,qAnswered,fetchAI]);

  const loadQ=useCallback(async()=>{
    setOptStates(["idle","idle","idle","idle"]);setAnswered(false);setShowExpl(false);setCurrentQ(null);
    const q=await getNext();setCurrentQ(q);
  },[getNext]);

  const startGame=useCallback(()=>{
    setHp(MAX_HP);setScore(0);setStreak(0);setBestStreak(0);setLevel(1);setQAnswered(0);
    usedIds.current.clear();setKnightState("idle");setPhase("playing");
    setTimeout(loadQ,80);
  },[loadQ]);

  useEffect(()=>{if(phase==="playing"&&!currentQ&&!aiLoading)loadQ();},[phase]);// eslint-disable-line

  const handleAnswer=useCallback((idx:number)=>{
    if(!currentQ||answered||optStates[idx]==="removed")return;
    const isCorrect=idx===currentQ.correct;
    if(isCorrect){
      const ns=streak+1,bonus=ns>=3?50:0;
      setOptStates(p=>p.map((s,i)=>i===idx?"correct":s==="idle"?"disabled":s));
      setStreak(ns);setBestStreak(b=>Math.max(b,ns));setScore(s=>s+SCORE_BASE+bonus);
      setQAnswered(q=>q+1);setAnswered(true);setShowExpl(true);
      setLevel(l=>Math.max(l,Math.floor(qAnswered/5)+1));
      setKnightState("victory");setTimeout(()=>setKnightState("cast"),850);setTimeout(()=>setKnightState("idle"),2000);
      timer.current=setTimeout(loadQ,2800);
    }else{
      const next=[...optStates];next[idx]="wrong";setOptStates(next);setStreak(0);
      const newHp=Math.max(0,hp-HP_PENALTY);setHp(newHp);
      setDmgFlash(true);setDmgNum(`−${HP_PENALTY}`);
      setTimeout(()=>setDmgFlash(false),350);setTimeout(()=>setDmgNum(null),1100);
      setKnightState("hurt");setTimeout(()=>setKnightState("idle"),650);
      setTimeout(()=>setOptStates(p=>{const n=[...p];if(n[idx]==="wrong")n[idx]="removed";return n;}),550);
      if(newHp<=0){setKnightState("dead");setQAnswered(q=>q+1);setTimeout(()=>{setGameOverCause("hp");setPhase("gameover");},1800);}
    }
  },[currentQ,answered,optStates,streak,hp,qAnswered,loadQ]);

  const handleGiveUp=useCallback(()=>{if(timer.current)clearTimeout(timer.current);setGameOverCause("giveup");setPhase("gameover");},[]);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);

  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden"}}>
      <EnchantedBG/>
      {phase==="intro"&&<IntroScreen onStart={startGame}/>}
      {phase==="gameover"&&<GameOverScreen score={score} streak={bestStreak} questionsAnswered={qAnswered} cause={gameOverCause} onRestart={()=>setPhase("intro")}/>}
      {phase==="playing"&&(
        <div style={{position:"relative",zIndex:10,height:"100%",display:"flex",flexDirection:"column"}}>
          {/* TOP BAR */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 20px 7px",flexShrink:0}}>
            <ScorePanel score={score} streak={streak} level={level}/>
            <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(0.8rem,2vw,1.1rem)",background:"linear-gradient(135deg,#20c997,#17a8c8,#4a90d9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 1px 5px rgba(32,201,151,0.35))",letterSpacing:"0.08em",animation:"runeGlow 3s ease-in-out infinite"}}>⚔ CYBER QUEST</div>
            <button onClick={handleGiveUp} style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.12em",color:"#c06060",background:"rgba(255,255,255,0.82)",border:"1.5px solid rgba(192,96,96,0.35)",borderRadius:20,padding:"6px 15px",cursor:"pointer",transition:"all 0.18s",backdropFilter:"blur(6px)",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#e05050";e.currentTarget.style.color="#e05050";e.currentTarget.style.background="rgba(255,240,240,0.92)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(192,96,96,0.35)";e.currentTarget.style.color="#c06060";e.currentTarget.style.background="rgba(255,255,255,0.82)";}}>
              🏳 GIVE UP
            </button>
          </div>
          {/* MAIN AREA */}
          <div style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 20px 22px",gap:24,position:"relative"}}>
            {/* KNIGHT */}
            <div style={{position:"relative",flexShrink:0,alignSelf:"flex-end",paddingBottom:4}}>
              <div style={{marginBottom:10,position:"relative"}}>
                <HPBar hp={hp} maxHp={MAX_HP}/>
                {dmgNum&&<div style={{position:"absolute",left:"50%",top:-6,fontFamily:"'Cinzel',serif",fontSize:"1.45rem",fontWeight:900,color:"#e05050",filter:"drop-shadow(0 0 8px rgba(224,80,80,0.55))",animation:"damageFloat 1.1s ease-out forwards",pointerEvents:"none",zIndex:20,whiteSpace:"nowrap"}}>{dmgNum}</div>}
              </div>
              <div style={{filter:dmgFlash?"brightness(2.5) saturate(0) sepia(1) hue-rotate(300deg)":"none",transition:"filter 0.04s"}}>
                <PixelKnight state={knightState}/>
              </div>
              <div style={{textAlign:"center",marginTop:5,fontFamily:"'Cinzel',serif",fontSize:"0.58rem",letterSpacing:"0.22em",color:"#0d9e75",textTransform:"uppercase",opacity:0.7}}>Sir Cipher</div>
            </div>
            {/* QUESTION CARD */}
            <div style={{flex:1,maxWidth:640,animation:currentQ?"fadeSlideIn 0.38s ease-out":"none"}}>
              {aiLoading&&!currentQ?(
                <div style={{background:"rgba(255,255,255,0.9)",border:"1.5px solid rgba(32,201,151,0.28)",borderRadius:16,padding:38,textAlign:"center",backdropFilter:"blur(8px)",boxShadow:"0 8px 30px rgba(32,100,80,0.1)"}}>
                  <div style={{fontFamily:"'Cinzel',serif",color:"#20c997",fontSize:"1rem",letterSpacing:"0.2em",animation:"runeGlow 1s ease-in-out infinite"}}>✦ The Oracle Speaks... ✦</div>
                  <div style={{color:"#7ab0a0",fontFamily:"'Crimson Text',serif",marginTop:10,fontStyle:"italic"}}>Summoning knowledge from the arcane scrolls...</div>
                </div>
              ):currentQ?(
                <div style={{background:"rgba(255,255,255,0.92)",border:"1.5px solid rgba(32,201,151,0.25)",borderRadius:16,overflow:"hidden",backdropFilter:"blur(10px)",boxShadow:"0 8px 36px rgba(32,100,80,0.12),0 2px 8px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)"}}>
                  {/* Header */}
                  <div style={{padding:"11px 17px 9px",borderBottom:"1px solid rgba(32,201,151,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(212,248,234,0.35)"}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><CategoryBadge category={currentQ.category}/></div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <DifficultyStars difficulty={currentQ.difficulty}/>
                      {currentQ.id.startsWith("ai_")&&<span style={{fontSize:"0.58rem",color:"#17a8c8",fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",border:"1px solid rgba(23,168,200,0.32)",borderRadius:4,padding:"1px 7px",background:"rgba(23,168,200,0.07)"}}>AI</span>}
                    </div>
                  </div>
                  {/* Question */}
                  <div style={{padding:"17px 19px 13px"}}>
                    <p style={{fontFamily:"'Crimson Text',serif",fontWeight:600,fontSize:"clamp(1rem,2.4vw,1.18rem)",color:"#1a3a30",lineHeight:1.65}}>
                      {currentQ.question}
                    </p>
                  </div>
                  {/* Options */}
                  <div style={{padding:"0 13px 13px",display:"flex",flexDirection:"column",gap:8}}>
                    {currentQ.options.map((opt:string,i:number)=>(
                      <OptionButton key={`${currentQ.id}-${i}`} label={opt} index={i} letter={(["A","B","C","D"][i])??"?"}
                        state={optStates[i]??"idle"} onClick={()=>handleAnswer(i)} disabled={answered}/>
                    ))}
                  </div>
                  {/* Explanation */}
                  {showExpl&&currentQ.explanation&&(
                    <div style={{margin:"0 13px 13px",padding:"11px 15px",background:"rgba(32,201,151,0.07)",border:"1.5px solid rgba(32,201,151,0.18)",borderRadius:10,animation:"fadeSlideIn 0.3s ease-out"}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.58rem",letterSpacing:"0.2em",color:"#20c997",marginBottom:5,textTransform:"uppercase"}}>✦ Lore Revealed</div>
                      <p style={{fontFamily:"'Crimson Text',serif",fontStyle:"italic",color:"#2a5a48",fontSize:"0.94rem",lineHeight:1.55,margin:0}}>{currentQ.explanation}</p>
                    </div>
                  )}
                  {/* Footer */}
                  {!answered&&(
                    <div style={{padding:"4px 17px 11px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontFamily:"'Nunito',sans-serif",color:"#7ab0a0",fontSize:"0.77rem"}}>Wrong answers cost {HP_PENALTY} Vitality</span>
                      <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.61rem",letterSpacing:"0.12em",color:optStates.filter(s=>s==="removed").length>0?"#c8800a":"#7ab0a0",opacity:0.85}}>
                        {4-optStates.filter(s=>s==="removed").length} options remain
                      </span>
                    </div>
                  )}
                </div>
              ):null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}