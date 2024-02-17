import { ServiceProps } from "@/components/Services/ServiceCard";
import { useGetServices } from "../../API/hooks/ServiceHooks";
import CategoryCard from "../../components/Categories/CategoryCard";
import styled from "styled-components";

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  container-type: inline-size;
  @media screen and (max-width: 950px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
`;

function Services() {
  // Pobranie usług z API
  // useGetServices to hook, który w środu stosuje useQuery z biblioteki react-query
  const { data } = useGetServices();
  const services = data?.data ?? [];
  // Tworzenie obiektu z usługami pogrupowanymi według kategorii
  const groupedServicesObject = services.reduce(
    (acc: Record<string, ServiceProps["service"][]>, service) => {
      if (!acc[service.category as keyof typeof acc]) {
        acc[service.category as keyof typeof acc] = [];
      }
      acc[service.category as keyof typeof acc].push(service);
      return acc;
    },
    {}
  );
  // Tworzenie tablicy kategorii z usługami
  const groupedServices = Object.entries(groupedServicesObject).sort((a, b) =>
    a[0].localeCompare(b[0])
  ) as [string, ServiceProps["service"][]][];

  // Podział tablicy na dwie części
  const firstHalf = groupedServices.slice(
    0,
    Math.ceil(Object.keys(groupedServices).length / 2)
  );
  const secondHalf = groupedServices.slice(
    Math.ceil(Object.keys(groupedServices).length / 2),
    Object.keys(groupedServices).length
  );

  return (
    <Body>
      {CategoryColumn(firstHalf)}
      {CategoryColumn(secondHalf)}
    </Body>
  );
}

export default Services;

function CategoryColumn(CategoryData: [string, ServiceProps["service"][]][]) {
  return (
    <Column>
      {Object.values(CategoryData).map((category) => {
        return <CategoryCard title={category[0]} services={category[1]} />;
      })}
    </Column>
  );
}
