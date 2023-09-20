import { Divider, Image } from "@chakra-ui/react";
import ItemInformation from "./ItemInformation";

interface SomeInformationsProp {
  imagem?: string;
  nome: string;
  nacionalidade: string;
  dataAniversario?: string;
  anos: string;
  altura:string
  peso:string
  ferido:string
  posicao:string
}

function SomeInformations({
  imagem,
  nome,
  nacionalidade,
  dataAniversario,
  anos,
  altura,
  peso,
  ferido,
  posicao
}: SomeInformationsProp) {
  return (
    <div className=" w-full  flex flex-col">
      <div className=" w-full flex items-center  p-2">
        <Image
          borderRadius="full"
          boxSize="50px"
          src={imagem}
          alt="Dan Abramov"
        />
        <span className=" text-lg font-extrabold text-[25px]">{nome}</span>
      </div>

      <Divider />

      <div className=" flex flex-col">
        <div className=" flex w-full ">
          <span className=" w-[33%]">
            <ItemInformation
              descricao={"Nacionalidade"}
              valor={nacionalidade}
            />
          </span>
          <span className=" w-[33%]">
            <ItemInformation
              descricao={dataAniversario as string}
              valor={anos}
            />
          </span>
          <span className=" w-[33%]">
            <ItemInformation
              descricao={"Altura"}
              valor={altura}
            />
          </span>
        </div>
        <div className=" flex w-full mt-5 ">
          <span className=" w-[33%]">
            <ItemInformation
              descricao={"Peso"}
              valor={peso}
            />
          </span>
          <span className=" w-[33%]">
            <ItemInformation
              descricao={"Ferido ?"}
              valor={ferido? "sim": "não"}
            />
          </span>
          <span className=" w-[33%]">
            <ItemInformation
              descricao={"Posição"}
              valor={posicao}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default SomeInformations;
