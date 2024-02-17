import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApiClient, queryClient } from "./API/apiClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopBar from "./components/shell/TopBar";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { mainTheme } from "./styles/theme";
import Home from "./pages/Home/Home";
import "./styles/typography.css";
import Test from "./pages/Test";
import Services from "./pages/Services/Services";
import Dashboard from "./pages/Admin/Dashboard";
import UserList from "./pages/Admin/UserList";
import Posts from "./pages/Posts/Posts";
import NewPost from "./pages/Posts/NewPost";
import SpecificPost, { loader as postLoader } from "./pages/Posts/SpecificPost";
import Planner from "./pages/Admin/Planner";
import { loadCldr } from "@syncfusion/ej2-base";
import { setCulture, setCurrencyCode } from "@syncfusion/ej2-base";
import * as numberData from "cldr-data/main/pl/numbers.json";
import * as timezoneData from "cldr-data/main/pl/timeZoneNames.json";
import * as gregorian from "cldr-data/main/pl/ca-gregorian.json";
import { useEffect } from "react";
import NewVisit from "./pages/Services/NewVisit";
loadCldr(gregorian, numberData, timezoneData);
setCulture("pl");

const router = createBrowserRouter([
  {
    path: "/",
    element: <TopBar />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "visit",
        children: [
          {
            path: "new/:serviceId",
            element: <NewVisit />,
          },
        ],
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            element: <Posts />,
          },
          {
            path: "new",
            element: <NewPost />,
          },
          {
            path: ":id",
            loader: postLoader,
            element: <SpecificPost />,
          },
        ],
      },
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <UserList />,
          },
          {
            path: "planner",
            element: <Planner />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    const t = document.getElementById("root")?.parentNode;
    if (t?.children?.length ?? 0 > 1) {
      t?.children[1].remove();
    }
  }, []);
  return (
    <>
      <ThemeProvider theme={mainTheme}>
        <GlobalStyle />

        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
*{
  /* outline: 1px solid red; */
  &::-webkit-scrollbar {
      border-radius: 20px; /* roundness of the scroll thumb */
      width: 10px; /* width of the entire scrollbar */
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 20px; /* roundness of the scroll thumb */
      background: color-mix(in oklch, transparent, ${({ theme }) =>
        theme.colors.primary[100]} 75%); /* color of the tracking area */
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) =>
        theme.colors.primary[200]}; /* color of the scroll thumb */
      border-radius: 20px; /* roundness of the scroll thumb */
      border: 4px solid transparent; /* creates padding around scroll thumb */
    }
}
  body {
    color: ${(props) => props.theme.colors.dark};
    background-color: color-mix(in oklab, ${(props) =>
      props.theme.colors.light} 30%, white);
    font-family: ${(props) => props.theme.fontFamily} !important;
    color: ${(props) => props.theme.colors.primary["800"]};

    scrollbar-gutter: stable;
    
  }
  
`;
export default App;
