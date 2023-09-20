import { StackDivider, Heading, Box, Stack, Image } from "@chakra-ui/react";
interface CardIdentifyPayerProp {
  nomeJogador: string;
  fotoJogador: string;
}
function CardIdentifyPlayer({
  nomeJogador,
  fotoJogador,
}: CardIdentifyPayerProp) {
  return (
    <div>
      {/* <Stack divider={<StackDivider />} spacing="4"> */}
        {/* <Box> */}
          {/* <Heading size="xs" textTransform="uppercase"> */}
            <div
              className=" w-full  flex  items-center justify-around min-h-[150px] rounded-[17px]   "
              style={{
                backgroundImage:
                  "linear-gradient(to right top, #64748b, #8c94a7, #b3b6c3, #d9dae1, #ffffff)",
              }}
            >
              <div className=" w-[200px] h-[200px]  flex justify-center items-center ">
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={fotoJogador}
                  alt="Dan Abramov"
                />
                {/* <span className=" w-full flex justify-center items-center  overflow-hidden rounded-[50%] p-1  ">
                <img
                  className="' min-h-full"
                  src={items.player.photo}
                  alt=""
                />
              </span> */}
              </div>
              <span className=" w-[70%] text-lg text-white">{nomeJogador}</span>
            </div>
            {/* <Divider /> */}
          {/* </Heading> */}
          {/* <Box pt="2" fontSize="sm"></Box> */}
        {/* </Box> */}
      {/* </Stack> */}
    </div>
  );
}

export default CardIdentifyPlayer;
