import martini from "@/assets/martini.png";
import { HeaderMenu } from "@components/header/menu";
import Image from "next/image";

export const Header = () => {
  return (
    <header className=" header-container">
      <div className="flex items-center justify-center space-x-5 md:space-x-10 md:px-10 px-5 ">
        <Image src={martini} alt="martini" width={50} height={50} />
        <div className="md:text-xl text-sm  md:block">Drunk Guru</div>
      </div>
      <div className="flex flex-row items-center justify-center space-x-5 md:space-x-10 md:px-10 px-5 ">
        <div className="text-5xl">
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};
