import React, { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Textarea,
  Center,
  Alert,
  Card,
  MantineProvider,
  Global,
  Select,
  Flex,
} from "@mantine/core";
import {
  IconBulb,
  IconAlertTriangle,
  IconCheck,
  IconSend,
  IconArrowLeft,
  IconLanguage,
} from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { supabaseClient } from "../../utility/supabaseClient";
import { FeedbackLogo } from "../../components/logobrand/FeedbackLogo";
import '../../i18n';

type FeedbackType = "suggestion" | "complaint" | null;

interface FormData {
  response: string;
}

interface ISuggestion {
  id: number;
  status: "active" | "pending" | "approved" | "rejected";
}

interface IComplaint {
  id: number;
  status: "active" | "pending" | "resolved" | "rejected";
}

export const StandaloneFeedback: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState<FeedbackType>(null);
  const [formData, setFormData] = useState<FormData>({ response: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestionsData, setSuggestionsData] = useState<ISuggestion[]>([]);
  const [complaintsData, setComplaintsData] = useState<IComplaint[]>([]);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  // Load active suggestions and complaints on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const { data: suggestions } = await supabaseClient
          .from('suggestions')
          .select('*')
          .eq('status', 'active');
        
        const { data: complaints } = await supabaseClient
          .from('complaints')
          .select('*')
          .eq('status', 'active');

        setSuggestionsData(suggestions || []);
        setComplaintsData(complaints || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleTypeSelection = (type: FeedbackType) => {
    setSelectedType(type);
    setFormData({ response: "" });
    setIsSubmitted(false);
  };

  const handleResponseChange = (value: string) => {
    setFormData({ response: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.response.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Obtener reference_id de la tabla correspondiente basado en el tipo y status activo
    let reference_id = 1; // fallback por defecto
    
    if (selectedType === "suggestion" && suggestionsData.length > 0) {
      const activeSuggestion = suggestionsData.find(s => s.status === "active");
      reference_id = activeSuggestion?.id || 1;
    } else if (selectedType === "complaint" && complaintsData.length > 0) {
      const activeComplaint = complaintsData.find(c => c.status === "active");
      reference_id = activeComplaint?.id || 1;
    }

    const submitData = {
      type: selectedType,
      response: formData.response.trim(),
      reference_id: reference_id,
    };

    try {
      const { error } = await supabaseClient
        .from('feedback_responses')
        .insert([submitData]);

      if (error) {
        console.error("Error submitting feedback:", error);
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setFormData({ response: "" });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Container size="md" py="xl">
        <Center style={{ minHeight: "80vh" }}>
          <Paper shadow="md" p="xl" radius="lg" withBorder style={{ maxWidth: 500, width: "100%" }}>
            <Stack align="center" spacing="lg">
              <div
                style={{
                  backgroundColor: "#e7f5e7",
                  borderRadius: "50%",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={48} color="#28a745" />
              </div>
              
              <Title order={2} ta="center" c="green">
                {t('feedback.success.title')}
              </Title>
              
              <Text ta="center" c="dimmed">
                {selectedType === "suggestion" 
                  ? t('feedback.success.message_suggestion')
                  : t('feedback.success.message_complaint')
                }
              </Text>

              <Button
                onClick={resetForm}
                variant="light"
                size="md"
              >
                <IconArrowLeft size={16} style={{ marginRight: 8 }} />
                {t('feedback.success.send_another')}
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      {/* Language Selector */}
      <Flex justify="flex-end" mb="md">
        <Select
          data={[
            { value: 'es', label: t('language.spanish') },
            { value: 'en', label: t('language.english') }
          ]}
          value={i18n.language}
          onChange={(value) => value && changeLanguage(value)}
          w={150}
        />
      </Flex>

      {/* Logo */}
      <Center mb="xl">
        <FeedbackLogo />
      </Center>

      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack spacing="xl">
          <div>
            <Text ta="center" c="dimmed" size="lg">
              {t('feedback.subtitle')}
            </Text>
          </div>

          {!selectedType && (
            <Stack spacing="lg">
              <Card
                shadow="sm"
                p="xl"
                radius="md"
                withBorder
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => handleTypeSelection("suggestion")}
                className="feedback-card"
              >
                <Stack align="center" spacing="md">
                  <div
                    style={{
                      backgroundColor: "#e3f2fd",
                      borderRadius: "50%",
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconBulb size={40} color="#1976d2" />
                  </div>
                  <Title order={3} ta="center">
                    {t('feedback.suggestion.title')}
                  </Title>
                  <Text ta="center" c="dimmed">
                    {t('feedback.suggestion.description')}
                  </Text>
                  <Button fullWidth>
                    {t('feedback.suggestion.button')}
                  </Button>
                </Stack>
              </Card>

              <Card
                shadow="sm"
                p="xl"
                radius="md"
                withBorder
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => handleTypeSelection("complaint")}
                className="feedback-card"
              >
                <Stack align="center" spacing="md">
                  <div
                    style={{
                      backgroundColor: "#fff3e0",
                      borderRadius: "50%",
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconAlertTriangle size={40} color="#f57c00" />
                  </div>
                  <Title order={3} ta="center">
                    {t('feedback.complaint.title')}
                  </Title>
                  <Text ta="center" c="dimmed">
                    {t('feedback.complaint.description')}
                  </Text>
                  <Button fullWidth color="orange">
                    {t('feedback.complaint.button')}
                  </Button>
                </Stack>
              </Card>
            </Stack>
          )}

          {selectedType && (
            <Stack spacing="lg">
              <Group position="apart" align="center">
                <Title order={2}>
                  {selectedType === "suggestion" ? t('feedback.suggestion.form_title') : t('feedback.complaint.form_title')}
                </Title>
                <Button
                  variant="subtle"
                  onClick={() => setSelectedType(null)}
                >
                  <IconArrowLeft size={16} style={{ marginRight: 8 }} />
                  {t('feedback.form.back')}
                </Button>
              </Group>

              <Alert
                icon={selectedType === "suggestion" ? <IconBulb size="1rem" /> : <IconAlertTriangle size="1rem" />}
                color={selectedType === "suggestion" ? "blue" : "orange"}
              >
                {selectedType === "suggestion" ? t('feedback.suggestion.alert_message') : t('feedback.complaint.alert_message')}
              </Alert>

              <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                  <Textarea
                    label={selectedType === "suggestion" ? t('feedback.suggestion.form_label') : t('feedback.complaint.form_label')}
                    placeholder={selectedType === "suggestion" ? t('feedback.suggestion.form_placeholder') : t('feedback.complaint.form_placeholder')}
                    required
                    minRows={5}
                    value={formData.response}
                    onChange={(e) => handleResponseChange(e.target.value)}
                    size="md"
                  />

                  <Group position="right" mt="md">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={!formData.response.trim()}
                      size="md"
                      color={selectedType === "suggestion" ? "blue" : "orange"}
                    >
                      <IconSend size={16} style={{ marginRight: 8 }} />
                      {isSubmitting ? t('feedback.form.sending') : t('feedback.form.send')}
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          )}
        </Stack>
      </Paper>

      <style>
        {`
          .feedback-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </Container>
  );
};