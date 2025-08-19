import React from "react";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
  List,
  ShowButton,
  EditButton,
  DeleteButton,
  DateField,
} from "@refinedev/mantine";

import {
  Box,
  Group,
  ScrollArea,
  Select,
  Table,
  Pagination,
} from "@mantine/core";

import { ColumnFilter, ColumnSorter } from "../../components/table";
import type { FilterElementProps, ISuggestion } from "../../interfaces";

export const SuggestionList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<ISuggestion>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
      },
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        meta: {
          filterOperator: "contains",
        },
        cell: function render({ getValue }) {
          const description = getValue() as string;
          return description?.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description;
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        meta: {
          filterElement: function render(props: FilterElementProps) {
            return (
              <Select
                defaultValue="pending"
                data={[
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
                {...props}
              />
            );
          },
          filterOperator: "eq",
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
              <EditButton hideText recordItemId={getValue() as number} />
              <DeleteButton hideText recordItemId={getValue() as number} />
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
    },
  } = useTable({
    columns,
  });

  return (
    <ScrollArea>
      <List>
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