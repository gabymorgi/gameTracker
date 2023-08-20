import { App } from "antd";
import React, { useCallback, useState } from "react";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { Options, query } from "@/hooks/useFetch";

export interface IAuthContext {
  loading: boolean;
  isAuthenticated?: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notification } = App.useApp();
  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem("jwt")
  );
  // check if token is valid and not expired
  const isAuthenticated = React.useMemo(() => {
    if (!token) return false;
    const decoded = jwtDecode(token);
    if (!decoded) return false;
    const exp = (decoded as jwt.JwtPayload).exp;
    if (!exp) return false;
    const now = Date.now() / 1000;
    return now < exp;
  }, [token]);
  const [loading, setLoading] = useState(true);

  const logOut = useCallback(async () => {
    console.log("logOut");
    localStorage.removeItem("jwt");
    setToken(null);
  }, []);

  const logIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        console.log("logIn", email, password);
        // type jwt
        const { token } = await query<{ token: string }>(
          "login",
          Options.POST,
          {},
          { email, password }
        );
        localStorage.setItem("jwt", token);
        setToken(token);
      } catch (error: any) {
        notification.error({
          message: "Error logging in:",
          description: error.message,
        });
      }
      setLoading(false);
    },
    [notification]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        logIn,
        logOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
