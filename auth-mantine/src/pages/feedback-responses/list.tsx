import React from "react";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { useList } from "@refinedev/core";
import {
  List,
  ShowButton,
  DateField,
} from "@refinedev/mantine";

import {
  Box,
  Group,
  ScrollArea,
  Select,
  Table,
  Pagination,
  Badge,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { IconBulb, IconAlertTriangle, IconDownload } from "@tabler/icons-react";

import { ColumnFilter, ColumnSorter } from "../../components/table";
import { StatsCard } from "../../components/dashboard";
import type { FilterElementProps, IFeedbackResponse } from "../../interfaces";

export const FeedbackResponseList: React.FC = () => {
  const { data: feedbackData } = useList<IFeedbackResponse>({
    resource: "feedback_responses",
  });

  const suggestionCount = feedbackData?.data?.filter(f => f.type === "suggestion").length || 0;
  const complaintCount = feedbackData?.data?.filter(f => f.type === "complaint").length || 0;

  const columns = React.useMemo<ColumnDef<IFeedbackResponse>[]>(
    () => [
      {
        id: "type",
        header: "Type",
        accessorKey: "type",
        cell: function render({ getValue }) {
          const type = getValue() as string;
          return (
            <Badge
              color={type === "suggestion" ? "blue" : "orange"}
              leftSection={type === "suggestion" ? <IconBulb size={12} /> : <IconAlertTriangle size={12} />}
            >
              {type}
            </Badge>
          );
        },
        meta: {
          filterElement: function render(props: FilterElementProps) {
            return (
              <Select
                data={[
                  { label: "Suggestion", value: "suggestion" },
                  { label: "Complaint", value: "complaint" },
                ]}
                {...props}
              />
            );
          },
          filterOperator: "eq",
        },
      },
      {
        id: "response",
        header: "Response",
        accessorKey: "response",
        cell: function render({ getValue }) {
          const response = getValue() as string;
          return response?.length > 100 
            ? `${response.substring(0, 100)}...` 
            : response;
        },
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "created_at",
        header: "Created At",
        accessorKey: "created_at",
        cell: function render({ getValue }) {
          return <DateField value={getValue() as string} format="LLL" />;
        },
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as number} />
            </Group>
          );
        },
      },
    ],
    [],
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQuery: { data: tableData },
    },
  } = useTable({
    columns,
  });

  const handleExportCSV = () => {
    const csvData = tableData?.data?.map(row => ({
      ID: row.id,
      Type: row.type,
      "Reference ID": row.reference_id,
      Response: row.response,
      "Created At": new Date(row.created_at).toLocaleDateString(),
    })) || [];

    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feedback-responses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ScrollArea>
      <List
        title="Feedback Dashboard"
        headerButtons={
          <Button
            onClick={handleExportCSV}
            variant="light"
          >
            <IconDownload size={16} style={{ marginRight: 8 }} />
            Export CSV
          </Button>
        }
      >
        <SimpleGrid cols={2} spacing="md" mb="xl">
          <StatsCard
            title="Total Suggestions"
            value={suggestionCount}
            icon={<IconBulb size={24} />}
            color="blue"
          />
          <StatsCard
            title="Total Complaints"
            value={complaintCount}
            icon={<IconAlertTriangle size={24} />}
            color="red"
          />
        </SimpleGrid>

        <Table highlightOnHover>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {!header.isPlaceholder && (
                        <Group spacing="xs" noWrap>
                          <Box>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </Box>
                          <Group spacing="xs" noWrap>
                            <ColumnSorter column={header.column} />
                            <ColumnFilter column={header.column} />
                          </Group>
                        </Group>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <br />
        <Pagination
          position="right"
          total={pageCount}
          page={current}
          onChange={setCurrent}
        />
      </List>
    </ScrollArea>
  );
};