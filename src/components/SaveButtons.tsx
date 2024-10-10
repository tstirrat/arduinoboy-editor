import { Flex } from "./Flex";
import { Button } from "primereact/button";
import { Task } from "../types";
import { PrimeIcons } from "primereact/api";

export const SaveButtons: React.FC<{
  onRefresh: Task;
  onReset: Task;
  onSave: Task;
  isConnected: boolean;
}> = ({ isConnected, onSave, onRefresh, onReset }) => {
  return (
    <Flex row align="center" justify="end">
      <Button
        severity="danger"
        label="Reset to defaults"
        onClick={onReset}
        disabled={!isConnected}
        icon={PrimeIcons.TRASH}
      />
      <Flex grow="1" />
      <Button
        severity="secondary"
        label="Refresh"
        onClick={onRefresh}
        disabled={!isConnected}
        icon={PrimeIcons.SYNC}
      />
      <Button
        label="Save changes"
        icon={PrimeIcons.SAVE}
        onClick={onSave}
        disabled={!isConnected}
      />
    </Flex>
  );
};
