'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Image
      onClick={() => router.push('/')}
      className="hidden md:block cursor-pointer" 
      src="/images/Logo10.png" 
      height={500} 
      width={500}
      style={{
        width: '6%',
        height: 'auto', 
      }}
      alt="Logo" 
      priority
    />
   );
}
 
export default Logo;