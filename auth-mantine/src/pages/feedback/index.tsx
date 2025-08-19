import React, { useState } from "react";
import type { ISuggestion, IComplaint } from "../../interfaces";
import { supabaseClient } from "../../utility/supabaseClient";
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
} from "@mantine/core";
import {
  IconBulb,
  IconAlertTriangle,
  IconCheck,
  IconSend,
  IconArrowLeft,
} from "@tabler/icons-react";
import { CustomTitle } from "../../components/logobrand/CustomTitle";

type FeedbackType = "suggestion" | "complaint" | null;

interface FormData {
  response: string;
}

export const FeedbackPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<FeedbackType>(null);
  const [formData, setFormData] = useState<FormData>({ response: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Supabase calls without Refine hooks
  const [suggestionsData, setSuggestionsData] = useState<ISuggestion[]>([]);
  const [complaintsData, setComplaintsData] = useState<IComplaint[]>([]);

  // Load active suggestions and complaints on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const { data: suggestions } = await supabaseClient
          .from('suggestions')
          .select('*')
          .eq('status', 'approved');
        
        const { data: complaints } = await supabaseClient
          .from('complaints')
          .select('*')
          .eq('status', 'resolved');

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
      // Obtener el primer suggestion activo (approved)
      const activeSuggestion = suggestionsData.find(s => s.status === "approved");
      reference_id = activeSuggestion?.id || 1;
    } else if (selectedType === "complaint" && complaintsData.length > 0) {
      // Obtener el primer complaint activo (resolved)
      const activeComplaint = complaintsData.find(c => c.status === "resolved");
      reference_id = activeComplaint?.id || 1;
    }

    const submitData = {
      type: selectedType,
      response: formData.response.trim(),
      reference_id: reference_id,
    };

    try {
      // Direct Supabase insert without Refine
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
                ¡Enviado Exitosamente!
              </Title>
              
              <Text ta="center" c="dimmed">
                Gracias por tu {selectedType === "suggestion" ? "sugerencia" : "reclamo"}. 
                Hemos recibido tu mensaje y lo revisaremos pronto.
              </Text>

              <Button
                onClick={resetForm}
                variant="light"
                size="md"
              >
                <IconArrowLeft size={16} style={{ marginRight: 8 }} />
                Enviar otro mensaje
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Center mb="xl">
        <CustomTitle />
      </Center>

      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack spacing="xl">
          <div>
            <Title order={1} ta="center" mb="xs">
              Centro de Feedback
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              Queremos escuchar tu opinión. Selecciona el tipo de mensaje que deseas enviar.
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
                    Sugerencia
                  </Title>
                  <Text ta="center" c="dimmed">
                    ¿Tienes una idea para mejorar nuestro servicio? Compártela con nosotros.
                  </Text>
                  <Button fullWidth>
                    Enviar Sugerencia
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
                    Reclamo
                  </Title>
                  <Text ta="center" c="dimmed">
                    ¿Hay algo que no está funcionando bien? Déjanos saber para poder mejorarlo.
                  </Text>
                  <Button fullWidth color="orange">
                    Enviar Reclamo
                  </Button>
                </Stack>
              </Card>
            </Stack>
          )}

          {selectedType && (
            <Stack spacing="lg">
              <Group position="apart" align="center">
                <Title order={2}>
                  {selectedType === "suggestion" ? "Nueva Sugerencia" : "Nuevo Reclamo"}
                </Title>
                <Button
                  variant="subtle"
                  onClick={() => setSelectedType(null)}
                >
                  <IconArrowLeft size={16} style={{ marginRight: 8 }} />
                  Volver
                </Button>
              </Group>

              <Alert
                icon={selectedType === "suggestion" ? <IconBulb size="1rem" /> : <IconAlertTriangle size="1rem" />}
                color={selectedType === "suggestion" ? "blue" : "orange"}
              >
                Completa el formulario para enviar tu {selectedType === "suggestion" ? "sugerencia" : "reclamo"}.
                Revisaremos tu mensaje y te responderemos pronto.
              </Alert>

              <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                  <Textarea
                    label={selectedType === "suggestion" ? "Tu sugerencia" : "Tu reclamo"}
                    placeholder={`Escribe tu ${selectedType === "suggestion" ? "sugerencia" : "reclamo"} aquí...`}
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
                      {isSubmitting ? "Enviando..." : "Enviar"}
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