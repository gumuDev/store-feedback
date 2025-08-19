import React, { useState, useRef } from "react";
import { List } from "@refinedev/mantine";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Alert,
  Center,
  Box,
} from "@mantine/core";
import { IconDownload, IconQrcode, IconInfoCircle } from "@tabler/icons-react";
import QRCode from "qrcode";

export const QRGeneratorList: React.FC = () => {
  const [qrDataURL, setQrDataURL] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const currentURL = window.location.origin;
      const feedbackURL = `${currentURL}/feedback`;
      
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, feedbackURL, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        });
        
        const dataURL = canvas.toDataURL();
        setQrDataURL(dataURL);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrDataURL) {
      const link = document.createElement("a");
      link.href = qrDataURL;
      link.download = `feedback-qr-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    }
  };

  const copyURL = () => {
    const currentURL = window.location.origin;
    const feedbackURL = `${currentURL}/feedback`;
    navigator.clipboard.writeText(feedbackURL);
  };

  return (
    <List title="QR Code Generator">
      <Container size="md">
        <Stack spacing="xl">
          <Alert icon={<IconInfoCircle size="1rem" />} title="QR Code for Feedback" color="blue">
            Generate a QR code that directs users to your feedback form. Perfect for printing on receipts, 
            posters, or sharing digitally.
          </Alert>

          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack spacing="lg" align="center">
              <Title order={3} ta="center">
                Feedback QR Code
              </Title>
              
              <Text c="dimmed" ta="center">
                URL: {window.location.origin}/feedback
              </Text>

              <Box>
                <canvas
                  ref={canvasRef}
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    display: qrDataURL ? "block" : "none"
                  }}
                />
                
                {!qrDataURL && (
                  <Center h={300} w={300} style={{ border: "2px dashed #ced4da", borderRadius: "8px" }}>
                    <Stack align="center" spacing="sm">
                      <IconQrcode size={48} color="#adb5bd" />
                      <Text c="dimmed" size="sm">QR Code will appear here</Text>
                    </Stack>
                  </Center>
                )}
              </Box>

              <Group>
                <Button
                  onClick={generateQR}
                  loading={isGenerating}
                  leftSection={<IconQrcode size={16} />}
                  size="md"
                >
                  {qrDataURL ? "Regenerate QR Code" : "Generate QR Code"}
                </Button>
                
                {qrDataURL && (
                  <Button
                    onClick={downloadQR}
                    variant="light"
                    leftSection={<IconDownload size={16} />}
                    size="md"
                  >
                    Download PNG
                  </Button>
                )}
              </Group>

              <Group>
                <Button
                  onClick={copyURL}
                  variant="subtle"
                  size="sm"
                >
                  Copy URL
                </Button>
              </Group>
            </Stack>
          </Paper>

          <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Title order={4} mb="md">How to use:</Title>
            <Stack spacing="xs">
              <Text size="sm">• Click "Generate QR Code" to create your QR code</Text>
              <Text size="sm">• Download the PNG file for printing or digital use</Text>
              <Text size="sm">• When scanned, the QR code directs users to: {window.location.origin}/feedback</Text>
              <Text size="sm">• Perfect for receipts, business cards, posters, or websites</Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </List>
  );
};