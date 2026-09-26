import React from 'react';
// Znak projektu: znak zachęty wiersza poleceń „›_”. Kursor mruga trzy razy po wczytaniu i zostaje zapalony.
export function LogoMark({size=44,title}){
 return <svg className="logo-mark" width={size} height={size} viewBox="0 0 48 48" role={title?'img':undefined} aria-hidden={title?undefined:true} aria-label={title}>
  <defs><linearGradient id="ipGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2b7d58"/><stop offset="1" stopColor="#1a5239"/></linearGradient></defs>
  <rect width="48" height="48" rx="13" fill="url(#ipGrad)"/>
  <path d="M14.5 14.5 24 24l-9.5 9.5" fill="none" stroke="#fff" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round"/>
  <rect className="logo-cursor" x="27" y="29.5" width="11" height="5" rx="2.2" fill="#c7ef6b"/>
 </svg>;
}
