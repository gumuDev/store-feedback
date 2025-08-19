import React from "react";
import {
  type AuthProvider,
  Authenticated,
  Refine,
} from "@refinedev/core";
import {
  ThemedLayoutV2,
  ErrorComponent,
  useNotificationProvider,
  AuthPage,
} from "@refinedev/mantine";
import { dataProvider } from "@refinedev/supabase";
import { supabaseClient } from "../../utility/supabaseClient";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { Routes, Route, Outlet } from "react-router";
import { IconBulb, IconAlertTriangle, IconDashboard, IconQrcode } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';

import { SuggestionCreate, SuggestionEdit, SuggestionList, SuggestionShow, ComplaintCreate, ComplaintEdit, ComplaintList, ComplaintShow, FeedbackResponseCreate, FeedbackResponseEdit, FeedbackResponseList, FeedbackResponseShow, QRGeneratorList } from "../../pages";
import { CustomTitle } from "../logobrand/CustomTitle";

interface TranslatedAppProps {
  authProvider: AuthProvider;
  authCredentials: {
    email: string;
    password: string;
    name: string;
  };
}

export const TranslatedApp: React.FC<TranslatedAppProps> = ({ authProvider, authCredentials }) => {
  const { t } = useTranslation();

  return (
    <Refine
      dataProvider={dataProvider(supabaseClient)}
      authProvider={authProvider}
      routerProvider={routerProvider}
      notificationProvider={useNotificationProvider}
      resources={[
        {
          name: "suggestions",
          list: "/suggestions",
          show: "/suggestions/show/:id",
          edit: "/suggestions/edit/:id",
          create: "/suggestions/create",
          meta: {
            label: t('navigation.suggestions'),
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
            label: t('navigation.complaints'),
            icon: <IconAlertTriangle/>
          }
        },
        {
          name: "feedback_responses",
          list: "/dashboard",
          show: "/feedback-responses/show/:id",
          edit: "/feedback-responses/edit/:id",
          create: "/feedback-responses/create",
          meta: {
            label: t('navigation.dashboard'),
            icon: <IconDashboard/>
          }
        },
        {
          name: "qr_generator",
          list: "/qr-generator",
          meta: {
            label: t('navigation.qr_generator'),
            icon: <IconQrcode/>
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
            element={<NavigateToResource resource="feedback_responses" />}
          />
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
          <Route path="/dashboard" element={<FeedbackResponseList />} />
          <Route path="/feedback-responses">
            <Route path="create" element={<FeedbackResponseCreate />} />
            <Route path="edit/:id" element={<FeedbackResponseEdit />} />
            <Route path="show/:id" element={<FeedbackResponseShow />} />
          </Route>
          <Route path="/qr-generator" element={<QRGeneratorList />} />
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

        {/* Auth Routes - Outside authenticated area */}
        <Route
          path="/login"
          element={
            <AuthPage
              type="login"
              title="Store Feedback"
              formProps={{
                initialValues: {
                  ...authCredentials,
                },
              }}
            />
          }
        />
        <Route
          path="/register"
          element={
            <AuthPage
              type="register"
              title="Store Feedback"
            />
          }
        />
        <Route
          path="/forgot-password"
          element={<AuthPage type="forgotPassword" title="Store Feedback" />}
        />
        <Route
          path="/update-password"
          element={<AuthPage type="updatePassword" title="Store Feedback" />}
        />
      </Routes>
      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
    </Refine>
  );
};