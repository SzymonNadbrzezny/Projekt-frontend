import { ApiClient, queryClient, userContext } from "@/API/apiClient";
import { useGetAppointments } from "@/API/hooks/AppointmentHooks";
import { useGetServices } from "@/API/hooks/ServiceHooks";
import { useGetEmployees } from "@/API/hooks/UserHooks";
import Input from "@/components/Form/Input";
import TitledModal from "@/components/Modal/TitledModal";
import Button from "@/components/Utils/StyledButton";
import { DevTool } from "@hookform/devtools";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Day,
  Week,
  WorkWeek,
  Month,
  DragAndDrop,
  Resize,
  Schedule,
  ActionEventArgs,
  CellClickEventArgs,
  SelectEventArgs,
} from "@syncfusion/ej2-react-schedule";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ElementRef, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { set } from "zod";
import FormSelect from "@/components/Form/Select";

Schedule.Inject(Day, WorkWeek, Month, Resize, DragAndDrop);
const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  color: ${({ theme }) => theme.colors.primary["700"]};
`;
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
const StyledSelect = styled(Select)`
  width: 100%;
`;

let scheduleObj: Schedule = new Schedule({
  firstDayOfWeek: 1,
  timeFormat: "HH:mm",
  views: [
    { option: "Day", isSelected: true },
    { option: "WorkWeek", isSelected: true },
  ],
  group: {
    byGroupID: false,
    byDate: true,
    resources: ["Employees"],
  },
  timeScale: {
    enable: true,
    interval: 30,
    slotCount: 2,
  },
  startHour: "08:00",
  endHour: "20:00",
  timezone: "UTC",
  eventSettings: {},
});
export default function NewVisit() {
  const newVisitService = useParams();
  const currentUser = useContext(userContext);
  const employeesQuery = useGetEmployees();
  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      return ApiClient.getClients();
    },
    staleTime: 1200000,
    refetchInterval: 1800000,
  });
  const servicesQuery = useGetServices();
  const appointmentsQuery = useGetAppointments();
  const ref = useRef<ElementRef<typeof TitledModal>>(null);
  const selectRef = useRef<ElementRef<typeof Select>>(null);
  const appointmentsMutation = useMutation({
    mutationKey: ["appointments"],
    mutationFn: (data: any) => {
      switch (data.type) {
        default:
          return ApiClient.post("/appointments", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
  const appointments = appointmentsQuery.isSuccess
    ? appointmentsQuery.data.data
    : ([] as Record<string, any>[]);

  const employees = employeesQuery.isSuccess
    ? employeesQuery.data.data.map((e, i) => ({
        ...e,
        color: "#6b6b6b",
      }))
    : [];
  const services = servicesQuery.isSuccess
    ? servicesQuery.data.data.map((s) => ({ ...s, sname: s.name, sid: s.id }))
    : [];
  // console.log(services);
  const clients = clientsQuery.isSuccess
    ? clientsQuery.data.data.map((w) =>
        w.id == (currentUser?.currentUser?.id ?? 0)
          ? { ...w, color: "#ff0000" }
          : w
      )
    : [];
  const {
    register,
    handleSubmit,
    control,
    formState,
    setError,
    setValue,
    formState: { errors },
  } = useForm<typeof appointmentData>({
    mode: "onBlur",
  });
  if (
    (employeesQuery.isLoading ||
      servicesQuery.isLoading ||
      appointmentsQuery.isLoading ||
      clientsQuery.isLoading) &&
    !(
      employeesQuery.isRefetching ||
      servicesQuery.isRefetching ||
      appointmentsQuery.isRefetching ||
      clientsQuery.isRefetching
    )
  )
    return <div>Loading...</div>;
  appointments.forEach((a) => {
    a.StartTime = new Date(a.date);
    a.EndTime = new Date(a.end_date);
    a.serviceId = a.service?.id;
    a.clientId = a.client?.id;
    a.workerId = a.worker?.id;
    a.worker = a.worker;
    a.Description = ``;
    a.Subject =
      a.client?.id === (currentUser.currentUser?.id ?? 0)
        ? "Twoja wizyta"
        : `Zajęte`;
  });
  scheduleObj.eventSettings = {
    allowEditing: false,
    allowDeleting: false,
    dataSource: appointments,
  };
  let appointmentData:
    | {
        StartTime: Date;
        EndTime: Date;
        Subject: string;
        IsAllDay: boolean;
        Description: string;
        serviceId: number;
        workerId: number;
        clientId: number;
      }
    | {} = {};
  scheduleObj.cellClick = (args: CellClickEventArgs) => {
    // var event = new MouseEvent("dblclick", {
    //   view: window,
    //   bubbles: true,
    //   cancelable: true,
    // });
    // (args.element as HTMLElement).dispatchEvent(event);
    // args.cancel = true;
    if (ref.current) {
      appointmentData = {
        StartTime: args.startTime,
        EndTime: args.endTime,
        Subject:
          services.find((s) => s.id == newVisitService.serviceId)?.name ?? "",
        IsAllDay: false,
        Description: "",
        serviceId: newVisitService.serviceId,
        workerId: -1,
        clientId: currentUser.currentUser?.id,
      };
      setValue("clientId", currentUser.currentUser?.id);
      setValue("serviceId", newVisitService.serviceId);
      setValue("StartTime", args.startTime);
      setValue("EndTime", args.endTime);
      setValue("Subject", appointmentData.Subject);
      setValue("IsAllDay", false);
      setValue("Description", "");

      ref.current.showModal();
    }
    args.cancel = true;
  };

  scheduleObj.select = (args: SelectEventArgs) => {
    if (args.requestType == "cellSelect") {
      console.log(args);
      if (ref.current) {
        appointmentData = {
          StartTime: args.data.StartTime,
          EndTime: args.data.EndTime,
          Subject:
            services.find((s) => s.id == newVisitService.serviceId)?.name ?? "",
          IsAllDay: false,
          Description: "",
          serviceId: newVisitService.serviceId,
          workerId: -1,
          clientId: currentUser.currentUser?.id,
        };
        console.log(appointmentData);
        setValue("clientId", currentUser.currentUser?.id);
        setValue("serviceId", newVisitService.serviceId);
        setValue("StartTime", appointmentData.StartTime);
        setValue("EndTime", appointmentData.EndTime);
        setValue("Subject", appointmentData.Subject);
        setValue("IsAllDay", false);
        setValue("Description", "");

        ref.current.showModal();
      }
    }
  };
  scheduleObj.actionBegin = (args: ActionEventArgs) => {
    if (args.requestType == "eventCreate") {
      appointmentsMutation.mutate({
        appointment: {
          service_id: args.data[0].serviceId,
          worker_id: args.data[0].workerId,
          client_id: args.data[0].clientId,
          date: args.data[0].StartTime,
          end_date: args.data[0].EndTime,
          comment: args.data[0].Description,
        },
      });
    }
  };
  scheduleObj.resources = [
    {
      field: "workerId",
      title: "Employee",
      name: "Employees",
      allowMultiple: false,
      dataSource: employees,
      textField: "name",
      idField: "id",
      colorField: "color",
    },
    {
      field: "serviceId",
      title: "Service",
      name: "Services",
      allowMultiple: false,
      dataSource: services,
      textField: "name",
      idField: "id",
      colorField: "color",
    },
    {
      field: "clientId",
      title: "Client",
      name: "Clients",
      allowMultiple: false,
      dataSource: clients,
      textField: "name",
      idField: "id",
      colorField: "color",
    },
  ];
  const s = document.getElementById("Schedule");
  s?.childNodes.forEach((node) => {
    s.removeChild(node);
  });
  scheduleObj.appendTo("#Schedule");

  return (
    <div>
      <TitledModal ref={ref} title="Nowa wizyta" opener={<></>}>
        {(props) => {
          return (
            <div>
              <Form
                onSubmit={handleSubmit((v) => {
                  if (v.payed === true) {
                    scheduleObj.addEvent(v);
                    appointmentData = {};
                  }
                })}
                name="loginForm"
              >
                <FormSelect
                  control={control}
                  name="workerId"
                  label="Pracownik"
                  desc="Wybierz pracownika"
                  values={employees}
                />
                <Input
                  type="checkbox"
                  name="payed"
                  label="Opłacone"
                  {...register("payed", { required: true })}
                />
                <FormRow>
                  <Button
                    buttonStyle="secondary"
                    onClick={() => props.closeFunction && props.closeFunction()}
                  >
                    Anuluj
                  </Button>
                  <Button
                    buttonStyle="primary"
                    type="submit"
                    onClick={() => {
                      props.submitFunction?.(formState.isSubmitSuccessful);
                    }}
                  >
                    Dodaj wizytę
                  </Button>
                </FormRow>
                <DevTool control={control} /> {/* set up the dev tool */}
              </Form>
            </div>
          );
        }}
      </TitledModal>
      <div id="Schedule"> </div>
    </div>
  );
}
