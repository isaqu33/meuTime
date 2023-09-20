import { Divider, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import useApi from "../server/api";

function TimesComponent() {
  const { GetTimesHome } = useApi();

  const { isLoading, data, isFetched } = useQuery(
    "Times",
    GetTimesHome,

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
          <div className=" w-full  flex  items-center justify-around ">
            <div className=" w-[30%]  flex justify-center items-center">
              <span className=" w-[30px] flex justify-center items-center  overflow-hidden rounded-[50%] p-1  ">
                <img className="' min-h-full" src={_item.team.logo} alt="" />
              </span>
            </div>
            <span className=" w-[70%]">{_item.team.name}</span>
          </div>

          <Divider />
        </div>
      ))}
    </div>
  );
}

export default TimesComponent;
