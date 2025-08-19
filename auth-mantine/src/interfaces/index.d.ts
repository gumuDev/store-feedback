import type { Column } from "@tanstack/react-table";

export interface ICategory {
  id: number;
  title: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
}

export interface ISuggestion {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: "active" | "pending" | "approved" | "rejected";
}

export interface IComplaint {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: "active" | "pending" | "resolved" | "rejected";
}

export interface IFeedbackResponse {
  id: number;
  type: "suggestion" | "complaint";
  reference_id: number;
  response: string;
  created_at: string;
}

export interface ColumnButtonProps {
  column: Column<any, any>; // eslint-disable-line
}

export interface FilterElementProps {
  value: any; // eslint-disable-line
  onChange: (value: any) => void; // eslint-disable-line
}
