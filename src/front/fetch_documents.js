const Url = "https://sample-service-name-bnt3.onrender.com/documents";

export const files={
     create_files: async (description, file, apartment_id, token) => {
    

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      console.error("Error: Solo se permiten archivos PDF");
      return { error: "Formato no válido. Solo se aceptan PDFs" };
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("document", file);
    formData.append("apartment_id", apartment_id);

    try {
      const response = await fetch(`${Url}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData.error);
        return { error: errorData.error || "Error en el servidor" };
      }

      return await response.json(); // { message, file_url, contract }
    } catch (error) {
      console.error("Error de red:", error);
      return { error: "Error de conexión. Revisa tu red" };
    }
  },
  downloadFile: async (documentId, token) => {
    try {
      const response = await fetch(`${Url}/download/${documentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al descargar:", errorData.error);
        return { error: errorData.error || "No se pudo descargar el documento" };
      }

      // Crear blob y disparar la descarga
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `documento_${documentId}.pdf`;  // puedes personalizar el nombre
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Error de red al descargar:", error);
      return { error: "Error de red. Intenta de nuevo." };
    }
  },

}