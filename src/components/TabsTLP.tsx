import {
  Tab,
  TabList,
  TabPanels,
  Tabs,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import TimesComponent from "./TimesComponent";
import JogadoresComponent from "./JogadoresComponent";

function TabsTLP() {
  const texte = true;

  return (
    <div className=" bg-slate-50 w-full md:max-w-[300px] flex flex-col items-center justify-center p-3 rounded-[17px] ">
      <h1 className=" font-extrabold">Sugestões</h1>

      <div className=" min-h-[400px]">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>Times</Tab>

            <Tab isDisabled={false}>Jogadores</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TimesComponent />
            </TabPanel>
            <TabPanel>
              <JogadoresComponent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}

export default TabsTLP;
