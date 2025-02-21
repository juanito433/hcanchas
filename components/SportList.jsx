import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { useSports } from "../lib/Sport";
import { SportImage } from "./SportImage";

export default function App() {
  const { sports, loading, fetchSports } = useSports();
  const { pickImage, uploadImage, selectedImages } = SportImage();

  //Estado para manejar el refresco
  const [refreshing, setRefreshing] = useState(false);

  const handleUpload = async (sportId) => {
    await uploadImage(sportId); // Subir imagen
    await fetchSports(); //Recargar la lista para obtener la nueva imagen
  };

  //Función para manejar la actualización de la lista
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSports();
    } catch (error) {
      console.error("Error al recargar:", error);
    }
    setRefreshing(false);
  }, [fetchSports]);

  //Contenedor adaptable para web y móvil
  const Container = ({ children }) => {
    return Platform.OS === "web" ? (
      <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
    ) : (
      <SafeAreaView
        style={{ flex: 1, paddingBottom: 60, backgroundColor: "#626567" }}
      >
        {children}
      </SafeAreaView>
    );
  };

  return (
    <Container>
      <View>
        <StatusBar style="light" />
        <Text style={styles.title}>Lista de Deportes</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={sports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.sportItem}>
                <Text style={styles.sportName}>{item.name}</Text>
                <Text style={styles.sportDescription}>{item.description}</Text>

                {item.image ? (
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.sportImage}
                    key={item.image} // 🔹 Clave única para re-renderizar
                  />
                ) : (
                  <Text style={styles.text}>No hay imagen disponible</Text>
                )}

                <Button
                  title="Seleccionar Imagen"
                  onPress={() => pickImage(item.id)}
                />

                {selectedImages[item.id] && (
                  <>
                    <Image
                      source={{ uri: selectedImages[item.id] }}
                      style={styles.previewImage}
                    />
                    <Pressable
                      style={styles.button}
                      onPress={() => handleUpload(item.id)}
                    >
                      <Text style={styles.buttonText}>Subir Imagen</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } //Agregamos refreshControl
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#7a7371",
    margin: 20,
  },
  text: {
    color: "#fff",
  },
  sportItem: {
    backgroundColor: "#4f4f4f",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sportName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  sportDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  sportImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    margin: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
});
