import React from 'react';
import Image from 'next/image';
import AuthBackgroundImage from "@/assets/Images/AuthBgImage.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen lg:h-screen xl:min-h-screen flex-col-reverse lg:flex-row">
      <div className="lg:w-1/2 w-full p-8 h-full flex flex-col items-center justify-center">
        <div>{children}</div>
        <p className="text-center text-gray-600 text-sm uppercase mt-16">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
      <div className="lg:w-1/2 w-full relative flex items-center p-4">
        <Image
          src={AuthBackgroundImage}
          alt="Authentication background"
          className='h-[98%] rounded-2xl'
          loading="lazy"
        />
      </div>
    </div>
  );
}