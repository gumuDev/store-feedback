import { useShow } from "@refinedev/core";
import { Show, DateField } from "@refinedev/mantine";

import { Title, Text, Badge } from "@mantine/core";
import { IconBulb, IconAlertTriangle } from "@tabler/icons-react";

import type { IFeedbackResponse } from "../../interfaces";

export const FeedbackResponseShow: React.FC = () => {
  const { query: queryResult } = useShow<IFeedbackResponse>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title order={5}>Id</Title>
      <Text mt="xs">{record?.id}</Text>

      <Title mt="xs" order={5}>
        Type
      </Title>
      <Badge
        mt="xs"
        color={record?.type === "suggestion" ? "blue" : "orange"}
        leftSection={record?.type === "suggestion" ? <IconBulb size={12} /> : <IconAlertTriangle size={12} />}
      >
        {record?.type}
      </Badge>

      <Title mt="xs" order={5}>
        Reference ID
      </Title>
      <Text mt="xs">{record?.reference_id}</Text>

      <Title mt="xs" order={5}>
        Response
      </Title>
      <Text mt="xs" style={{ whiteSpace: "pre-wrap" }}>
        {record?.response}
      </Text>

      <Title mt="xs" order={5}>
        Created At
      </Title>
      <DateField mt="xs" value={record?.created_at} format="LLL" />
    </Show>
  );
};