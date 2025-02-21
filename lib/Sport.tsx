import { useState, useEffect } from "react";
import { Alert } from "react-native";

export function useSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los deportes desde el backend
  const fetchSports = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://172.16.3.137:8000/api/sports");
      if (!response.ok) throw new Error("Error al obtener los deportes");
      const data = await response.json();
      setSports(data);
    } catch (error) {
      console.error("Error al obtener los deportes:", error);
      Alert.alert("Error", "No se pudo cargar la lista de deportes");
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchSports al montar el componente
  useEffect(() => {
    fetchSports();
  }, []);

  return { sports, loading, fetchSports };
}
