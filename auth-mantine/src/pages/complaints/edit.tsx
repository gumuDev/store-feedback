import { Edit, useForm } from "@refinedev/mantine";
import { Select, TextInput, Textarea } from "@mantine/core";

export const ComplaintEdit: React.FC = () => {
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
          placeholder="Enter complaint title"
          {...getInputProps("title")}
        />
        <Textarea
          mt={8}
          label="Description"
          placeholder="Enter complaint description"
          minRows={4}
          {...getInputProps("description")}
        />
        <Select
          mt={8}
          label="Status"
          placeholder="Pick one"
          {...getInputProps("status")}
          data={[
            { label: "Pending", value: "pending" },
            { label: "Resolved", value: "resolved" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
      </form>
    </Edit>
  );
};