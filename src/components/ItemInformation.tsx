
interface ItemInformationProp{
    descricao:string;
    valor:string
}
function ItemInformation({descricao,valor}:ItemInformationProp) {
  return (
    <div className=" w-full flex flex-col justify-center items-center ">
        <span className=" font-thin text-[#00000048] ">{descricao}</span>
        <p>{valor}</p>
    </div>
  )
}

export default ItemInformation