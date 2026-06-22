import { RequestForm } from "@/components/request-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/mm.png"
              alt="Logo"
              width={140}
              height={40}
              quality={100}
              priority
              style={{ objectFit: "contain" }}
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RequestForm />
          </div>
        </div>
      </div>
      <div className="relative hidden  lg:block w-full">
        <Image
          src="/hero-pupilaje.jpg"
          alt="Pupilaje"
          fill
          quality={100}
          priority
          className="object-cover dark:brightness-[0.5] dark:grayscale -z-10 "
        />
      </div>
    </div>
  );
}
