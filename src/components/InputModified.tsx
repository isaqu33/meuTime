// import { useField } from "@unform/core";
// import { Info } from "phosphor-react";
import { useField } from "@unform/core";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";


interface InputModifiedProps {
  nome: string;
}

function InputModified({ nome }: InputModifiedProps) {
  const { fieldName, defaultValue, registerField, error } = useField(nome);

  const [values, setValues] = useState(defaultValue || "");

  console.log(values);

  useEffect(() => {
    registerField({
      name: fieldName,
      // ref: inputRef,
      getValue: () => values,
      setValue: (_, newValue) => {
        setValues(newValue);
      },
      // clearValue: (ref) => {
      //   ref.current.value = "";
      // },
    });
  }, [fieldName, registerField, values]);

  return (
    <div className=" mb-10">
      <Input
        // name={name}
        // ref={inputRef}
        onChange={(e) => setValues(e.target.value)}
        defaultValue={defaultValue}
        value={values}
        _focus={{ color: "#00816A" }}
        _active={{ color: "#8A2BE2" }}
        _expanded={{ color: "#8A2BE2" }}
        _focusVisible={{ color: "#2f2e41" }}
        variant="filled"
        placeholder="         Chave de Acesso"
        _placeholder={{ color: "#63515191" }}
      />

      {error && <div className="text-[#ff000091]">{error}</div>}
    </div>
  );
}

export default InputModified;
