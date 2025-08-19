"use client";

import React, { useEffect, useState } from "react";
import { supabaseClient } from "../../utility/supabaseClient";

type AboutRecord = {
  id: number;
  slug: string;
  status: string;
};

export const AboutList: React.FC = () => {
  const [data, setData] = useState<AboutRecord[]>([]);
  console.log("Supabase URL:", supabaseClient);

  useEffect(() => {
    // 👇 pedimos los datos a supabase
    supabaseClient
      .from("forms") // nombre de tu tabla en Supabase
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error cargando datos:", error.message);
        } else {
          setData(data || []);
        }
      });
  }, []);

  return (
    <div>
      <h1>About desde Supabase</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>{item.slug}</strong> – {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutList;
