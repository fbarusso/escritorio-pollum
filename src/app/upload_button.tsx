"use client";

import React, { useRef, useState, ChangeEvent, useCallback } from "react";
import {
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
  Card,
  Stack,
} from "@mui/material";

const SEPARATOR = "|";

const useFileHandler = () => {
  const [fileName, setFileName] = useState<string>("");
  const [modifiedContent, setModifiedContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "text/plain") {
        setFileName(file.name);
        try {
          const content = await file.text();
          const lines = content.split("\n");

          const modifiedLines: string[] = [];

          for (let i = 0; i < lines.length; i += 2) {
            const inputLine5100 = lines[i];
            const inputLine5110 = lines[i + 1];

            if (!inputLine5100 || !inputLine5110) break;

            // Split input values and remove the first and last elements
            const inputValues5100 = inputLine5100.split(SEPARATOR).slice(1, -1);
            const inputValues5110 = inputLine5110.split(SEPARATOR).slice(1, -1);

            // Initialize output arrays with default sizes
            const outputValues5100 = Array(24).fill("");
            const outputValues5110 = Array(9).fill("");

            // Copy values from input 5100
            for (let index = 0; index < 19; index++) {
              outputValues5100[index] = inputValues5100[index] || "";
            }

            // Set specific values for 5100
            outputValues5100[3] = inputValues5100[3] || "0";
            outputValues5100[11] = inputValues5100[11] || "0,00";
            outputValues5100[19] = inputValues5110[9] || "";

            // Copy values from input 5110
            for (let index = 0; index < 9; index++) {
              outputValues5110[index] = inputValues5110[index] || "";
            }

            // Set specific values for 5110
            outputValues5110[2] = "2077";
            outputValues5110[3] = "2007";
            outputValues5110[8] = "";

            // Construct the output lines
            const outputLine5100 =
              SEPARATOR + outputValues5100.join(SEPARATOR) + SEPARATOR + "\n";
            const outputLine5110 =
              SEPARATOR + outputValues5110.join(SEPARATOR) + SEPARATOR + "\n";

            // Add modified lines to the array
            modifiedLines.push(outputLine5100, outputLine5110);
          }

          // Update the modified content state
          setModifiedContent(modifiedLines.join(""));
        } catch (err) {
          console.error("Error reading file:", err);
          setError("Failed to read the file.");
        }
      } else {
        setError("Please upload a valid .txt file.");
        event.target.value = "";
      }
    },
    []
  );

  const handleDownload = useCallback(() => {
    const blob = new Blob([modifiedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `convertido_${fileName}`;
    document.body.appendChild(a);
    a.click();
    a.addEventListener("click", () => URL.revokeObjectURL(url));
    document.body.removeChild(a);
  }, [modifiedContent, fileName]);

  return {
    fileName,
    modifiedContent,
    handleFileChange,
    handleDownload,
    error,
    setError,
  };
};

const UploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    fileName,
    modifiedContent,
    handleFileChange,
    handleDownload,
    error,
    setError,
  } = useFileHandler();

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <Card
      variant="outlined"
      sx={{ backgroundColor: "#121212", border: "1px solid #353738" }}
    >
      <Box sx={{ p: 4 }}>
        <Typography gutterBottom variant="h5" className="text-primary">
          Pollum parser
        </Typography>
        <Typography variant="body2" className="text-secondary">
          Conversão de arquivos de pagamentos (registros 5100 e 5110).
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#373737" }} />
      <Box sx={{ p: 4 }}>
        <Stack direction={"column"}>
          <Typography variant="body2" className="text-secondary">
            {fileName
              ? `Arquivo selecionado: ${fileName}`
              : "Nenhum arquivo selecionado."}{" "}
          </Typography>
          <Box height={16} />
          <Stack direction="row" justifyContent={"space-between"}>
            <Button onClick={handleButtonClick}>SELECIONAR ARQUIVO</Button>
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              aria-label="Upload .txt file"
            />
            {modifiedContent && (
              <Button
                variant="contained"
                onClick={handleDownload}
                disabled={!modifiedContent}
              >
                BAIXAR ARQUIVO
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default UploadButton;