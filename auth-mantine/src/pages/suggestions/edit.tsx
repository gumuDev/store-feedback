import { Edit, useForm } from "@refinedev/mantine";
import { Select, TextInput, Textarea } from "@mantine/core";

export const SuggestionEdit: React.FC = () => {
  const {
    saveButtonProps,
    getInputProps,
  } = useForm({
    initialValues: {
      title: "",
      description: "",
      status: "",
    },
    validate: {
      title: (value) => (value.length < 2 ? "Too short title" : null),
      description: (value) => (value.length < 10 ? "Too short description" : null),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Title"
          placeholder="Enter suggestion title"
          {...getInputProps("title")}
        />
        <Textarea
          mt={8}
          label="Description"
          placeholder="Enter suggestion description"
          minRows={4}
          {...getInputProps("description")}
        />
        <Select
          mt={8}
          label="Status"
          placeholder="Pick one"
          {...getInputProps("status")}
          data={[
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
      </form>
    </Edit>
  );
};