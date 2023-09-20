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
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
} from '@chakra-ui/react'
import useApi from '../server/api'
import { useQuery, useQueryClient } from 'react-query'
import { useParams, Link } from 'react-router-dom'
import CardIdentifyPlayer from '../components/CardIdentifyPlayer'
import { ArrowLineRight, ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import SomeInformations from '../components/SomeInformations'
import Chart from 'react-google-charts'
import { GraficoTatico } from '../components/GraficoTatico'

// import { Box } from "framer-motion";
// import { Stack } from "phosphor-react";

function InfoPlayers() {
  const { GetPlayerById } = useApi()
  // const { id } = useParams();
  const verifyRouter = useParams()
  const queryClient = useQueryClient()

  const { isLoading, data, isFetched } = useQuery(
    'jogadorPorid',
    () => GetPlayerById(verifyRouter.id as string),

    // {
    //   staleTime: 1000 * 1000,
    // }
  )

  useEffect(() => {
    queryClient.resetQueries('jogadorPorid')
  }, [verifyRouter])

  // console.log(id);

  // console.log(data);
  // console.log(data[0]?.player.age);

  if (isLoading) {
    return (
      <div className="w-full  flex justify-center items-center">
        <Card>
          <Spinner color="grin" size="xl" />
        </Card>
      </div>
    )
  }

  console.log(data)
  // console.log(data[0]?.statistics[0].team.logo)

  return (
    <div className=" w-full max-w-[1000px] ">
      <div className=" p-1 w-full  mb-6">
        <Breadcrumb spacing="8px" separator={<ArrowRight size={12} />}>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              to="/"
              className=" bg-[#5c9bb680] text-[white] p-2 rounded-lg"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href="player/:id"
              className="  bg-[#5C9BB6] text-[white] p-2 rounded-lg"
            >
              Jogador
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <CardIdentifyPlayer
        nomeJogador={`${data[0]?.player.firstname} ${data[0]?.player.lastname} `}
        fotoJogador={data[0]?.player.photo}
      />

      <Card className=" mt-10">
        <CardBody>
          <div className=" w-full   flex justify-center   max-[763px]:flex-col   ">
            <div className=" w-full md:min-w-[50%] mr-0 md:mr-8">
              <SomeInformations
                dataAniversario={data[0]?.player.birth.date}
                anos={data[0]?.player.age}
                imagem={data[0].statistics[0].team.logo}
                nome={data[0].statistics[0].team.name}
                nacionalidade={data[0]?.player.nationality}
                altura={data[0]?.player.height}
                peso={data[0]?.player.weight}
                ferido={data[0]?.player.injured}
                posicao={data[0]?.statistics[0].games.position}
              />

              <div className=" mt-8">
                <h1 className=" mb-3 pl-2 font-extrabold">
                  Times com participação na temporada
                </h1>

                <Divider />

                <div className=" flex items-center justify-center  p-2 mt-7 ">
                  {data[0]?.statistics.map((item: any, _index: any) => (
                    <div className="  w-full flex flex-col" key={_index}>
                      <Image
                        borderRadius="full"
                        boxSize="50px"
                        src={item.team.logo}
                        alt="Dan Abramov"
                      />
                      <span className=" w-full text-lg font-extrabold text-[20px] flex justify-center items-center ">
                        {item.team.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className=" w-full md:min-w-[50%] mt-10">
              <GraficoTatico infos={data} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default InfoPlayers
