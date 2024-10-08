import { useId } from "react";
import { Flex } from "./Flex";

export const Field: React.FC<{
  label: string;
  children: (id: string) => React.ReactNode;
}> = ({ label, children }) => {
  const id = useId();
  return (
    <Flex row align="center" gap={8} style={{ alignContent: "center" }}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </Flex>
  );
};
