import {
  Tab,
  TabList,
  TabPanels,
  Tabs,
  TabPanel,
  Divider,
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import TimesComponent from "./TimesComponent";
import Chooses from "./Chooses";


const steps = [
    { title: 'País', description: 'Contact Info' },
    { title: 'Temporada', description: 'Date & Time' },
    { title: 'Liga', description: 'Select Rooms' },
    { title: 'Time', description: 'Select Rooms' },
  ]
  
  function Example() {
    const { activeStep } = useSteps({
      index: 1,
      count: steps.length,
    })
  
    return (
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
              
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    )
  }

function TabschooseTeams() {
  const texte = true;

  return (
    <div className=" bg-slate-50 w-full p-5  flex flex-col items-center justify-center rounded-[17px] ">

        
      <div className=" min-h-[200px] mt-8">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>País</Tab>
            <Tab isDisabled={true}>Temporada</Tab>
            <Tab isDisabled={true}>Liga</Tab>
            <Tab isDisabled={true}>Time</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Chooses />
            </TabPanel>
            <TabPanel>
              <Chooses />
            </TabPanel>
            <TabPanel>
              <Chooses />
            </TabPanel>
            <TabPanel>
              <Chooses />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}

export default TabschooseTeams;
