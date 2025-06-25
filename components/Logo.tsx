// components/Logo.tsx
import React from 'react'
import Image from 'next/image'
import logo from '../public/logo.png' // or wherever your file is

export default function Logo() {
  return (
    <img src="/L.png" alt="Lurnex L" style={{ height: '2rem' }} />
  )
}
