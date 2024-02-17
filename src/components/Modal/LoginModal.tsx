import { useForm } from "react-hook-form";
import Dialog from "./Dialog";
import Button from "../Utils/StyledButton";
import styled from "styled-components";
import { ApiClient, userContext } from "@/API/apiClient";
import Input from "../Form/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import {
  UserLogin,
  UserRegister,
  userLoginSchema,
  userRegisterSchema,
} from "@/API/types/user";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Body = styled.div`
  max-width: 60vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
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
const Confirmed = styled.div<{ confirmed?: boolean }>`
  border-radius: 10px;
  color: ${({ confirmed }) => (confirmed ? "green" : "red")};
`;
function LoginModal({ text = "Zaloguj się" }: { text?: string }) {
  const [LRswitch, setLRswitch] = useState<"login" | "register">("login");
  const [searchParams, _setSearchParams] = useSearchParams();
  const confirmed = searchParams.get("confirmed");
  return (
    <Dialog
      modalId="login-modal"
      opener={<Button buttonStyle="nav">{text}</Button>}
      defaultOpen={confirmed == "true" || confirmed == "false"}
    >
      {(props) => {
        return (
          <Body>
            {LRswitch == "login"
              ? LoginForm({ props, setLRswitch })
              : RegisterForm({ props, setLRswitch })}
          </Body>
        );
      }}
    </Dialog>
  );
}

export default LoginModal;
function LoginForm({
  props,
  setLRswitch,
}: {
  props: {
    closeFunction?: (() => void) | undefined;
    submitFunction?: ((shouldClose: boolean) => void) | undefined;
  };
  setLRswitch: React.Dispatch<React.SetStateAction<"login" | "register">>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState,
    setError,
    formState: { errors },
  } = useForm<UserLogin>({
    mode: "onBlur",
    resolver: zodResolver(userLoginSchema),
  });
  const { login: loginFn } = useContext(userContext);
  const [searchParams, _setSearchParams] = useSearchParams();
  const confirmed = searchParams.get("confirmed");
  const confirmedEmail = () => {
    if (confirmed == "true") {
      return "Twoje konto zostało aktywowane";
    } else if (confirmed == "false") {
      return "Twoje konto nie zostało aktywowane";
    }
  };
  const onSubmit = (data: UserLogin) => {
    return ApiClient.login(data)
      .then((res) => {
        if (res.code == 200) {
          return ApiClient.me().then((res) => {
            console.log(res);
            loginFn(res);
            return true;
          });
        }
      })
      .catch((_err) => {
        setError("email", { message: _err.response.data });
        setError("password", { message: _err.response.data });
        return false;
      });
  };
  return (
    <>
      <h3>Login</h3>
      {(confirmed == "true" || confirmed == "false") && (
        <Confirmed confirmed={confirmed == "true"}>
          {confirmedEmail()}
        </Confirmed>
      )}
      <Form onSubmit={handleSubmit(onSubmit)} name="loginForm" method="get">
        <Input
          type="email"
          placeholder="email"
          error={errors.email?.message}
          {...register("email", { required: true })}
          label="Email"
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="password"
          autoComplete="current-password"
          label="Hasło"
          {...register("password", { required: true })}
          error={errors.password?.message}
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
            outlined
            onClick={() => setLRswitch("register")}
          >
            Zarejestruj się
          </Button>
          <Button
            buttonStyle="primary"
            type="submit"
            onClick={() => {
              props.submitFunction?.(formState.isSubmitSuccessful);
            }}
          >
            Zaloguj się
          </Button>
        </FormRow>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Form>
    </>
  );
}

function RegisterForm({
  props,
  setLRswitch,
}: {
  props: {
    closeFunction?: (() => void) | undefined;
    submitFunction?: ((shouldClose: boolean) => void) | undefined;
  };
  setLRswitch: React.Dispatch<React.SetStateAction<"login" | "register">>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState,
    getValues,
    setError,
    formState: { errors },
  } = useForm<UserRegister>({
    mode: "onBlur",
    resolver: zodResolver(userRegisterSchema),
  });
  const { login } = useContext(userContext);
  //@ts-ignore
  const _SearchParams = useSearchParams();
  const onSubmit = (data: UserRegister) => {
    return ApiClient.register(data)
      .then((res) => {
        if (res.code == 200) {
          return ApiClient.me().then((res) => {
            if (res.status == 200) {
              login(res.data.data);
              return true;
            }
          });
        }
      })
      .catch((err) => {
        setError("email", { message: err.response.data });
        setError("password", { message: err.response.data });
        return false;
      });
  };
  return (
    <>
      <h3>Rejestracja</h3>
      <Form onSubmit={handleSubmit(onSubmit)} name="loginForm" method="get">
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email", { required: true })}
          label="Email"
        />
        <Input
          type="text"
          placeholder="Imię i nazwisko"
          error={errors.name?.message}
          {...register("name", { required: true })}
          label="Imię i nazwisko"
        />
        <Input
          type="password"
          placeholder="Hasło"
          error={errors.password?.message}
          {...register("password", { required: true })}
          label="Hasło"
        />
        <Input
          type="password"
          placeholder="Potwierdź hasło"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation", { required: true })}
          label="Potwierdź hasło"
        />
        <FormRow>
          <Button
            buttonStyle="secondary"
            onClick={() => {
              reset(getValues());
              props.closeFunction && props.closeFunction();
            }}
          >
            Anuluj
          </Button>
          <Button
            buttonStyle="primary"
            outlined
            onClick={() => setLRswitch("login")}
          >
            Zaloguj się
          </Button>
          <Button
            buttonStyle="primary"
            type="submit"
            onClick={() => {
              props.submitFunction?.(formState.isSubmitSuccessful);
            }}
          >
            Zarejestruj się
          </Button>
        </FormRow>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Form>
    </>
  );
}
