import { useEffect, useState } from "react";


function screenSize() {
    //logica para saber o tamanho da tela ao fazer a alteração da mesma

    const [width, setWidth] = useState(window.innerWidth);

    const updateDimensions = () => {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return width;
}

export default screenSize