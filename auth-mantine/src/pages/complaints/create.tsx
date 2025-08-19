import { Create, useForm } from "@refinedev/mantine";
import { Select, TextInput, Textarea } from "@mantine/core";
import { useList, useCreate, useUpdateMany, useGo } from "@refinedev/core";

export const ComplaintCreate: React.FC = () => {
  const { mutate: updateMany } = useUpdateMany({
    successNotification: false,
  });
  const { mutate: create } = useCreate();
  const go = useGo();

  const { data: activeComplaints } = useList({
    resource: "complaints",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "active",
      },
    ],
  });

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      status: "active",
    },
    validate: {
      title: (value) => (value.length < 2 ? "Too short title" : null),
      description: (value) => (value.length < 10 ? "Too short description" : null),
    },
  });

  const { saveButtonProps, getInputProps } = form;

  const handleSave = () => {
    const isValid = form.validate();
    
    if (isValid.hasErrors) return;
    
    const values = form.values;
    
    // Reset dirty state immediately to prevent "unsaved changes" alert
    form.resetDirty();

    if (activeComplaints?.data && activeComplaints.data.length > 0) {
      const activeIds = activeComplaints.data.map((item) => item.id).filter((id): id is number => id !== undefined);
      
      // Update existing active complaints to resolved in the background (no notification)
      updateMany(
        {
          resource: "complaints",
          ids: activeIds,
          values: { status: "resolved" },
        },
        {
          onSuccess: () => {
            // Create new complaint and navigate to list
            create({
              resource: "complaints",
              values,
            }, {
              onSuccess: () => {
                go({ to: "/complaints" });
              }
            });
          },
        }
      );
    } else {
      create({
        resource: "complaints",
        values,
      }, {
        onSuccess: () => {
          go({ to: "/complaints" });
        }
      });
    }
  };

  const customSaveButtonProps = {
    ...saveButtonProps,
    onClick: handleSave,
  };

  return (
    <Create saveButtonProps={customSaveButtonProps}>
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
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Resolved", value: "resolved" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
      </form>
    </Create>
  );
};