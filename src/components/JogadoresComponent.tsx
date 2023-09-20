import { Divider, Spinner } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "react-query";
import useApi from "../server/api";
import { Link } from "react-router-dom";

function JogadoresComponent() {
  const { GetPlayersHome } = useApi();

  const { isLoading, data, isFetched } = useQuery(
    "jogadores",
    GetPlayersHome,

    {
      staleTime: 1000 * 1000,
    }
  );

  // console.log(data);

  if (isLoading) {
    return (
      <div className=" w-full flex justify-center items-center ">
        <Spinner color="grin" size="xl" />
      </div>
    );
  }

  return (
    <div>
      {data?.map((_item: any, _index: any) => (
        <div
          key={_index}
          className=" w-full flex flex-col  justify-around  mb-2 hover:cursor-pointer "
        >
          <Link to={`player/${_item.player.id}`}>
            <div className=" w-full  flex  items-center justify-around ">
              <div className=" w-[30%]  flex justify-center items-center">
                <span className=" w-[30px] flex justify-center items-center  overflow-hidden rounded-[50%] p-1  ">
                  <img
                    className="' min-h-full"
                    src={_item.player.photo}
                    alt=""
                  />
                </span>
              </div>
              <span className=" w-[70%]">{_item.player.firstname}</span>
            </div>
          </Link>

          <Divider />
        </div>
      ))}
    </div>
  );
}

export default JogadoresComponent;
