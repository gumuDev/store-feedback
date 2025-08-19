import { useShow } from "@refinedev/core";
import { Show, DateField } from "@refinedev/mantine";

import { Title, Text, Badge } from "@mantine/core";

import type { ISuggestion } from "../../interfaces";

export const SuggestionShow: React.FC = () => {
  const { query: queryResult } = useShow<ISuggestion>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "pending":
      default:
        return "blue";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Title order={5}>Id</Title>
      <Text mt="xs">{record?.id}</Text>

      <Title mt="xs" order={5}>
        Title
      </Title>
      <Text mt="xs">{record?.title}</Text>

      <Title mt="xs" order={5}>
        Description
      </Title>
      <Text mt="xs" style={{ whiteSpace: "pre-wrap" }}>
        {record?.description}
      </Text>

      <Title mt="xs" order={5}>
        Status
      </Title>
      <Badge mt="xs" color={getStatusColor(record?.status || "")}>
        {record?.status}
      </Badge>

      <Title mt="xs" order={5}>
        Created At
      </Title>
      <DateField mt="xs" value={record?.created_at} format="LLL" />
    </Show>
  );
};