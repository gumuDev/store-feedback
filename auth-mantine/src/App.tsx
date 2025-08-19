import {
  type AuthProvider,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import {
  AuthPage,
  ThemedLayoutV2,
  ErrorComponent,
  useNotificationProvider,
  RefineThemes,
} from "@refinedev/mantine";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider, Global } from "@mantine/core";
import { dataProvider } from "@refinedev/supabase";
import { supabaseClient } from "./utility/supabaseClient";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { IconBrandGoogle, IconBrandGithub, IconMoneybag, IconBulb, IconAlertTriangle } from "@tabler/icons-react";

import { PostCreate, PostEdit, PostList, PostShow, SuggestionCreate, SuggestionEdit, SuggestionList, SuggestionShow, ComplaintCreate, ComplaintEdit, ComplaintList, ComplaintShow } from "./pages";
import { AboutList } from "./pages/about/list";
import { CustomTitle } from "./components/logobrand/CustomTitle";

/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "gumu@gmail.com",
  password: "demodemo",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ providerName, email }) => {
      if (providerName === "google") {
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
        return {
          success: true,
        };
      }

      if (providerName === "github") {
        window.location.href = "https://github.com/login/oauth/authorize";
        return {
          success: true,
        };
      }

      if (email === authCredentials.email) {
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
      name: "Jane Doe",
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    }),
  };

  return (
    <BrowserRouter>
      <MantineProvider
        theme={RefineThemes.Blue}
        withNormalizeCSS
        withGlobalStyles
      >
        <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
        <NotificationsProvider position="top-right">
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "posts",
                list: "/posts",
                show: "/posts/show/:id",
                edit: "/posts/edit/:id",
                create: "/posts/create",
              },
              {
                name: "about",
                list: "/about",
                meta: {
                  label: "About", 
                  icon: <IconMoneybag/>
                }
              },
              {
                name: "suggestions",
                list: "/suggestions",
                show: "/suggestions/show/:id",
                edit: "/suggestions/edit/:id",
                create: "/suggestions/create",
                meta: {
                  label: "Suggestions",
                  icon: <IconBulb/>
                }
              },
              {
                name: "complaints",
                list: "/complaints",
                show: "/complaints/show/:id",
                edit: "/complaints/edit/:id",
                create: "/complaints/create",
                meta: {
                  label: "Complaints",
                  icon: <IconAlertTriangle/>
                }
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Title={CustomTitle}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="posts" />}
                />

                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route>
                <Route path="/suggestions">
                  <Route index element={<SuggestionList />} />
                  <Route path="create" element={<SuggestionCreate />} />
                  <Route path="edit/:id" element={<SuggestionEdit />} />
                  <Route path="show/:id" element={<SuggestionShow />} />
                </Route>
                <Route path="/complaints">
                  <Route index element={<ComplaintList />} />
                  <Route path="create" element={<ComplaintCreate />} />
                  <Route path="edit/:id" element={<ComplaintEdit />} />
                  <Route path="show/:id" element={<ComplaintShow />} />
                </Route>
                <Route path="/about" element={<AboutList />} />
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          ...authCredentials,
                        },
                      }}
                      providers={[
                        {
                          name: "google",
                          label: "Sign in with Google",
                          icon: <IconBrandGoogle />,
                        },
                        {
                          name: "github",
                          label: "Sign in with GitHub",
                          icon: <IconBrandGithub />,
                        },
                      ]}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      providers={[
                        {
                          name: "google",
                          label: "Sign in with Google",
                          icon: <IconBrandGoogle />,
                        },
                        {
                          name: "github",
                          label: "Sign in with GitHub",
                          icon: <IconBrandGithub />,
                        },
                      ]}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
