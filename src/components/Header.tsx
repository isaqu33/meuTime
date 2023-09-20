import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  ModalFooter,
  // Lorem,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  useDisclosure,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DrawerOverlay,
  DrawerHeader,
  Fade,
  Slide,
} from "@chakra-ui/react";
import { SoccerBall, Tabs } from "phosphor-react";

import Infouser from "./Infouser";

import img from "../assets/img-bg-02-min_to_login.png";
import { useState } from "react";
import TimesComponent from "./TimesComponent";
import TabsTLP from "./TabsTLP";
import TabschooseTeams from "./TabschooseTeams";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  //  const { isOpen, onToggle } = useDisclosure()
  const [placement, setPlacement] = useState("right");

  return (
    <div className=" w-full    flex justify-center items-center  ">
      <div
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" w-full max-w-[1300px] bg-slate-50  rounded-lg   h-full  flex md:flex-row flex-col-reverse p-[10px] items-center justify-around"
      >
        <span
          onClick={onOpen}
          className="w-[100%] md:max-w-[300px]  h-[40px] rounded-[17px] flex justify-around items-center p-1 bg-[#00816A] cursor-pointer text-[#FFFFFF] text-[14px]  hover:bg-[#0081696e]"
        >
          <div className="flex w-full justify-center items-center font-bold">
            Pesquise por ligas ou copas{" "}
          </div>
        </span>

        {/* -------------------------------------------------------------------- */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className=" flex justify-center items-center">Ligas e Copas ao redor do mundo!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text className=" flex justify-center items-center">
                OBS: Para conseguir visualizar dados da escolha de seu time, escolha item por item, até conseguir ver o resultado final!!
              </Text>
              <TabschooseTeams></TabschooseTeams>
              {/* <Lorem count={2} /> */}
            </ModalBody>

            
          </ModalContent>
        </Modal>

        <div className=" w-full max-w-[500px] h-10 md:text-[20px] pb-2 md:p-0 text-[20px] text-[#00816A]  flex justify-center items-center mb-4 md:mb-0">
          <span className=" rounded-[17px] bg-[#ffffffa8] font-bold">
            Soccer-Mania
          </span>{" "}
          <SoccerBall size={56} color="#00914B" weight="duotone" />
        </div>

        <div className=" mb-5 md:mb-0">
          <Infouser></Infouser>
        </div>
      </div>
    </div>
  );
}

export default Header;
