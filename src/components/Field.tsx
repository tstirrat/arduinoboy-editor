import { useId } from "react";
import { Flex } from "./Flex";

export const Field: React.FC<{
  label: string;
  vertical?: boolean;
  children: (id: string) => React.ReactNode;
}> = ({ label, children, vertical }) => {
  const id = useId();
  return (
    <Flex
      row={!vertical}
      col={vertical}
      align="center"
      style={{ alignContent: "center" }}
    >
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </Flex>
  );
};
