import { Alert, Platform } from "react-native";
import React, { useState } from "react";
import { useSports } from "../lib/Sport";
import * as ImagePicker from "expo-image-picker";

export function SportImage() {
  const { fetchSports } = useSports();
  const [selectedImages, setSelectedImages] = useState({});
  

  // Función para seleccionar imagen para un deporte específico por ID
  const pickImage = async (sportId) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages((prev) => ({
        ...prev,
        [sportId]: result.assets[0].uri,
      }));
    }
  };

  // Función para subir imagen al servidor
  const uploadImage = async (sportId) => {
    if (!selectedImages[sportId]) {
      Alert.alert("Error", "Selecciona una imagen primero");
      return;
    }

    let formData = new FormData();
    formData.append("image", {
      uri: selectedImages[sportId],
      name: `sport_${sportId}.jpg`,
      type: "image/jpeg",
    });

    let headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    if (Platform.OS === "web") {
      const response = await fetch(selectedImages[sportId]);
      const blob = await response.blob();
      formData.append("image", blob, `sport_${sportId}.jpg`);
      headers = {};
    }

    try {
      let response = await fetch(
        `http://172.16.3.137:8000/api/sport/upload/${sportId}`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      let data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Imagen subida correctamente");

        await fetchSports();

        //Eliminar la imagen seleccionada después de subirla
        setSelectedImages((prev) => {
          const newImages = { ...prev };
          delete newImages[sportId];
          return newImages;
        });
      } else {
        Alert.alert("Error", data.message || "No se pudo subir la imagen");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo subir la imagen");
    }
  };

  return { pickImage, uploadImage, selectedImages };
}
