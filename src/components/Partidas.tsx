import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  StackDivider,
  Box,
  Text,
  Stack,
  Divider,
} from "@chakra-ui/react";
import useApi from "../server/api";
import { useQuery } from "react-query";
// import { Box } from "framer-motion";
// import { Stack } from "phosphor-react";

function Partidas() {
  const { GetPlayersAlive } = useApi();

  const { isLoading, data, isFetched } = useQuery(
    "jogosAovivo",
    GetPlayersAlive,

    {
      staleTime: 1000 * 1000,
    }
  );

  // console.log(data);

  if (JSON.stringify(data) == "[]") {
    return (
      <div className=" w-full">
        <Card>
          <CardHeader>
            <Heading size="md">Jogos ao Vivo</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <p>Nenhum jogo disponível no momento!</p>
            </Stack>
          </CardBody>
        </Card>
      </div>
    );
  }

  // console.log(JSON.stringify(data));

  return (
    <div className=" w-full">
      <Card>
        <CardHeader>
          <Heading size="md">Jogos ao Vivo</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {data?.map((items: any, intex: any) => (
              <Box key={intex}>
                <Heading size="xs" textTransform="uppercase">
                  <div className=" w-full flex">
                    <div className=" w-[30%]  flex justify-center items-center ">
                      <span className=" w-[30px] flex justify-center items-center  overflow-hidden rounded-[50%] p-1  ">
                        <img
                          className="min-h-full"
                          src={
                            items.league.flag
                              ? items.league.flag
                              : "https://api.sofascore.app/api/v1/unique-tournament/384/image"
                          }
                          alt=""
                        />
                      </span>
                    </div>
                    <div className=" w-[70%]  flex flex-col justify-start items-start  ">
                      <p className=" text-[#00816A] text-[0.6rem] font-thin">
                        {items.league.country}
                      </p>
                      <p>{items.league.name}</p>
                    </div>
                  </div>
                  {/* <Divider /> */}
                </Heading>
                <Box pt="2" fontSize="sm">
                  <div className=" mt-4">
                    <div className=" w-full  flex ">
                      <div className=" w-[50%] flex ">
                        <div className=" w-[90%]  flex flex-col justify-center items-center">
                          <span className=" w-[70px] flex justify-center items-center p-1  ">
                            <img
                              className="min-w-full"
                              src={
                                items.teams.home.logo
                                  ? items.teams.home.logo
                                  : "https://api.sofascore.app/api/v1/unique-tournament/384/image"
                              }
                              alt=""
                            />
                          </span>

                          <span className=" font-extrabold  text-[#00816A]">
                            {items.teams.home.name}
                          </span>
                        </div>

                        <span className=" flex justify-center items-center">
                          <p>{items.goals.home}</p>
                        </span>
                      </div>
                      {/* ----------------------------------------------------------------------------- */}

                      <div className=" w-[50%] flex ">
                        <span className=" flex justify-center items-center">
                          <p>{items.goals.away}</p>
                        </span>

                        <div className=" w-[90%]  flex flex-col justify-center items-center">
                          <span className=" w-[70px] flex justify-center items-center p-1  ">
                            <img
                              className="min-w-full"
                              src={
                                items.teams.away.logo
                                  ? items.teams.away.logo
                                  : "https://api.sofascore.app/api/v1/unique-tournament/384/image"
                              }
                              alt=""
                            />
                          </span>

                          <span className=" font-extrabold  text-[#00816A]">
                            {items.teams.away.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export default Partidas;
