import { Card, Text, Group, Badge } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

interface StatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  previousValue, 
  icon, 
  color = "blue" 
}) => {
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return Math.abs(change).toFixed(1);
  };

  const isPositive = previousValue && value > previousValue;
  const change = calculateChange();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={600}>
          {title}
        </Text>
        <div style={{ color }}>{icon}</div>
      </Group>

      <Group align="flex-end" spacing="sm">
        <Text size="xl" fw={700}>
          {value.toLocaleString()}
        </Text>
        
        {change && (
          <Badge
            color={isPositive ? "green" : "red"}
            variant="light"
            size="sm"
            leftSection={
              isPositive ? (
                <IconArrowUpRight size={12} />
              ) : (
                <IconArrowDownRight size={12} />
              )
            }
          >
            {change}%
          </Badge>
        )}
      </Group>

      {previousValue && (
        <Text size="xs" c="dimmed" mt={5}>
          Previous period: {previousValue.toLocaleString()}
        </Text>
      )}
    </Card>
  );
};