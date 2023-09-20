import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { UserCircleGear } from "phosphor-react";

import screenSize from "../hooks/screenSize";

function Infouser() {
  const tamanhoTela = screenSize();

  return (
    <div className="    ">
      <Popover>
        <PopoverTrigger>
          <div
            style={{
              backgroundColor: `${tamanhoTela <= 767 ? "#98B0A9" : "#98B0A9"}`,
              
            }}
            // style={{backgroundColor:"darkblue"}}
            className=" flex justify-center items-center p-2 text-[#ffffff] rounded-[17px]"
          >
            <UserCircleGear
              className=" hover:cursor-pointer"
              size={40}
              color={"white"}
              weight="duotone"
              
            />
            {tamanhoTela <= 767 ? "Usuario" : null}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Isaque</PopoverHeader>
          <PopoverBody>
            isaqueferreiradesousa@gmail.com
            <span
              onClick={() => console.log("apertou para sair")}
              className="w-[100%] md:max-w-[250px]  h-[40px] rounded-[17px] text-[white] flex justify-around items-center p-1 bg-[#fb0101] cursor-pointer  text-[14px]  hover:bg-[#fb0101b9] mt-4"
            >
              <div className="flex w-full justify-around items-center">
                Sair
              </div>
            </span>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Infouser;
