import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Control, Controller, FieldValues } from "react-hook-form";
import styled from "styled-components";
type props = {
  name: string;
  control: Control<FieldValues>;
  label: string;
  desc: string;
  values: any[];
  props?: Parameters<typeof Select>[0];
  sCProps?: Parameters<typeof SelectContent>[0];
  sTProps?: Parameters<typeof SelectTrigger>[0];
  sVProps?: Parameters<typeof SelectValue>[0];
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  color: ${({ theme }) => theme.colors.primary["700"]};
`;
function FormSelect({
  control,
  name,
  label,
  desc,
  props,
  values = [],
  sCProps,
  sTProps,
  sVProps,
  ...rest
}: props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <StyledDiv>
          <span>{label}</span>
          <Select
            {...props}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger {...sTProps}>
              <SelectValue {...sVProps} />
            </SelectTrigger>
            <SelectContent {...sCProps} ref={field.ref}>
              {values.map((e) => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StyledDiv>
      )}
    />
  );
}

export default FormSelect;
