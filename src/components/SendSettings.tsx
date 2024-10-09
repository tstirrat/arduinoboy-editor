import { Flex } from "./Flex";
import { Button } from "primereact/button";
import { Task } from "../types";

export const SendSettings: React.FC<{
  onRefresh: Task;
  onSave: Task;
}> = ({ onSave, onRefresh }) => {
  return (
    <Flex row align="center" justify="end">
      <Button severity="info" label="Refresh" onClick={onRefresh} />
      <Button label="Save changes" onClick={onSave} />
    </Flex>
  );
};
