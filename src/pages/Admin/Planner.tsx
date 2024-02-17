import { ApiClient, queryClient } from "@/API/apiClient";
import { useGetAppointments } from "@/API/hooks/AppointmentHooks";
import { useGetServices } from "@/API/hooks/ServiceHooks";
import { useGetEmployees } from "@/API/hooks/UserHooks";
import {
  Day,
  Week,
  WorkWeek,
  Month,
  DragAndDrop,
  Resize,
  Schedule,
  ActionEventArgs,
} from "@syncfusion/ej2-react-schedule";
import { useMutation, useQuery } from "@tanstack/react-query";

Schedule.Inject(Day, Week, WorkWeek, Month, Resize, DragAndDrop);

let scheduleObj: Schedule = new Schedule({
  firstDayOfWeek: 1,
  timeFormat: "HH:mm",
  group: {
    byGroupID: false,
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
export default function Planner() {
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
  const appointmentsMutation = useMutation({
    mutationKey: ["appointments"],
    mutationFn: (data: any) => {
      switch (data.type) {
        case "delete":
          return ApiClient.delete("/appointments/" + data.id);
        case "update":
          return ApiClient.patch("/appointments/" + data.id, data.appointment);
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
        color: i < 1 ? "#ffaa00" : "#00aaff",
      }))
    : [];
  const services = servicesQuery.isSuccess
    ? servicesQuery.data.data.map((s) => ({ ...s, sname: s.name, sid: s.id }))
    : [];
  // console.log(services);
  const clients = clientsQuery.isSuccess ? clientsQuery.data.data : [];
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
    a.Description = `${a.service?.description} \n---\n${a.comment ?? ""}`;
    a.Subject = `${a.service?.name} | ${a.client?.name}`;
  });
  scheduleObj.actionBegin = (args: ActionEventArgs) => {
    let weekEnds: number[] = [0, 6];
    // Blokada tworzenia wydarzeń w weekendy
    if (
      args.requestType == "eventCreate" &&
      weekEnds.indexOf(args?.data?.[0]?.StartTime.getDay() as number) >= 0
    ) {
      args.cancel = true;
      return;
    }
    // Tworzenie nowego wydarzenia
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
    // Aktualizacja wydarzenia
    if (args.requestType == "eventChange") {
      appointmentsMutation.mutate({
        type: "update",
        id: args.data.id,
        appointment: {
          service_id: args.data.serviceId,
          worker_id: args.data.workerId,
          client_id: args.data.clientId,
          date: (args.data.StartTime as Date).toUTCString(),
          end_date: (args.data.EndTime as Date).toUTCString(),
          comment: args.data.Description.split("\n---\n")[1],
        },
      });
    }
    // Usuwanie wydarzenia
    if (args.requestType == "eventRemove") {
      appointmentsMutation.mutate({
        type: "delete",
        id: args.data[0].id,
      });
    }
  };
  scheduleObj.eventSettings = {
    dataSource: appointments,
  };
  scheduleObj.resources = [
    {
      field: "serviceId",
      title: "Service",
      name: "Services",
      allowMultiple: false,
      dataSource: services,
      textField: "name",
      idField: "id",
    },
    {
      field: "clientId",
      title: "Client",
      name: "Clients",
      allowMultiple: false,
      dataSource: clients,
      textField: "name",
      idField: "id",
    },
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
  ];
  scheduleObj.appendTo("#Schedule");
  return (
    <div>
      <div id="Schedule"> </div>
    </div>
  );
}
