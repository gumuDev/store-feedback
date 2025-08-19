import {
  type AuthProvider,
} from "@refinedev/core";
import {
  RefineThemes,
} from "@refinedev/mantine";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider, Global } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StandaloneFeedback } from "./pages/feedback/StandaloneFeedback";
import { TranslatedApp } from "./components/i18n/TranslatedApp";
import './i18n';

const queryClient = new QueryClient();

/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "gumu@gmail.com",
  password: "demodemo",
  name: "Gumu",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
      if (email === authCredentials.email && password === authCredentials.password) {
        localStorage.setItem("email", email);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    },
    register: async (params) => {
      if (params.email === authCredentials.email && params.password) {
        localStorage.setItem("email", params.email);
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    },
    updatePassword: async (params) => {
      if (params.password === authCredentials.password) {
        //we can update password here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Invalid password",
        },
      };
    },
    forgotPassword: async (params) => {
      if (params.email === authCredentials.email) {
        //we can send email with reset password link here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Forgot password failed",
          name: "Invalid email",
        },
      };
    },
    logout: async () => {
      localStorage.removeItem("email");
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return { error };
    },
    check: async () =>
      localStorage.getItem("email")
        ? {
            authenticated: true,
          }
        : {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Not authenticated",
            },
            logout: true,
            redirectTo: "/login",
          },
    getPermissions: async () => ["admin"],
    getIdentity: async () => ({
      id: 1,
      name: authCredentials.name,
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    }),
  };

  // Check if current path is /feedback to render standalone page
  if (window.location.pathname === '/feedback') {
    return (
      <MantineProvider
        theme={RefineThemes.Blue}
        withNormalizeCSS
        withGlobalStyles
      >
        <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
        <StandaloneFeedback />
      </MantineProvider>
    );
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={RefineThemes.Blue}
          withNormalizeCSS
          withGlobalStyles
        >
          <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
          <NotificationsProvider position="top-right">          
            <TranslatedApp authProvider={authProvider} authCredentials={authCredentials} />
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
