import { Create, useForm } from "@refinedev/mantine";
import { Select, TextInput, Textarea, NumberInput } from "@mantine/core";

export const FeedbackResponseCreate: React.FC = () => {
  const { saveButtonProps, getInputProps } = useForm({
    initialValues: {
      type: "",
      reference_id: 0,
      response: "",
    },
    validate: {
      type: (value) => (!value ? "Type is required" : null),
      reference_id: (value) => (value <= 0 ? "Reference ID is required" : null),
      response: (value) => (value.length < 10 ? "Response must be at least 10 characters" : null),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <form>
        <Select
          mt={8}
          label="Type"
          placeholder="Select feedback type"
          {...getInputProps("type")}
          data={[
            { label: "Suggestion", value: "suggestion" },
            { label: "Complaint", value: "complaint" },
          ]}
        />
        <NumberInput
          mt={8}
          label="Reference ID"
          placeholder="Enter the ID of the suggestion or complaint"
          {...getInputProps("reference_id")}
          min={1}
        />
        <Textarea
          mt={8}
          label="Response"
          placeholder="Enter your response"
          minRows={4}
          {...getInputProps("response")}
        />
      </form>
    </Create>
  );
};