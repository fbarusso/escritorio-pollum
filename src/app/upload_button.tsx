"use client";

import React, {
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
} from "react";
import {
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
  Card,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import * as chardet from 'chardet';

const SEPARATOR = "|";

const useFileHandler = (type: string) => {
  const [fileName, setFileName] = useState<string>("");
  const [modifiedContent, setModifiedContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const parseFile = useCallback(
    async (file: File) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const encoding = chardet.detect(Buffer.from(arrayBuffer)) || "utf-8";
        const decoder = new TextDecoder(encoding);
        const content = decoder.decode(arrayBuffer);
        const lines = content.split("\n");

        console.log("Encoding: ", encoding);

        const modifiedLines: string[] = [];

        if (type === "payments") {
          for (let i = 0; i < lines.length; i += 2) {
            const inputLine5100 = lines[i];
            const inputLine5110 = lines[i + 1];

            // End of file
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
        } else if (type === "receipts") {
          for (let i = 0; i < lines.length; i += 2) {
            const inputLine5200 = lines[i];
            const inputLine5210 = lines[i + 1];

            // End of file
            if (!inputLine5200 || !inputLine5210) break;

            // Split input values and remove the first and last elements
            const inputValues5200 = inputLine5200.split(SEPARATOR).slice(1, -1);
            const inputValues5210 = inputLine5210.split(SEPARATOR).slice(1, -1);

            // Initialize output arrays with default sizes
            const outputValues5200 = Array(25).fill("");
            const outputValues5210 = Array(9).fill("");

            // Copy values from input 5200
            for (let index = 0; index < 19; index++) {
              outputValues5200[index] = inputValues5200[index] || "";
            }

            // Set specific values for 5200
            outputValues5200[17] = "";
            outputValues5200[8] = inputValues5200[9];
            outputValues5200[9] = inputValues5200[8];

            // Copy values from input 5210
            for (let index = 0; index < 9; index++) {
              outputValues5210[index] = inputValues5210[index] || "";
            }

            // Set specific values for 5210
            outputValues5210[2] = "2007";
            outputValues5210[3] = "2016";

            // Construct the output lines
            const outputLine5200 =
              SEPARATOR + outputValues5200.join(SEPARATOR) + SEPARATOR + "\n";
            const outputLine5210 =
              SEPARATOR + outputValues5210.join(SEPARATOR) + SEPARATOR + "\n";

            // Add modified lines to the array
            modifiedLines.push(outputLine5200, outputLine5210);
          }
        }

        // Update the modified content state
        setModifiedContent(modifiedLines.join(""));
      } catch (err) {
        console.log("Ocorreu um erro ao converter o arquivo: ", err);
        setError("Ocorreu um erro ao converter o arquivo");
      }
    },
    [type]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "text/plain") {
        setFileName(file.name);
        setFile(file);
        parseFile(file);
      } else {
        setError("Ocorreu um erro ao converter o arquivo");
        event.target.value = "";
      }
    },
    [parseFile]
  );

  const handleDownload = useCallback(() => {
    const blob = new Blob([modifiedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const prefix = type === "payments" ? "pag" : "rec";
    a.href = url;
    a.download = `${prefix}_convertido_${fileName}`;
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
    parseFile,
    file,
  };
};

const UploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [type, setType] = useState("payments");

  const {
    fileName,
    modifiedContent,
    handleFileChange,
    handleDownload,
    error,
    setError,
    parseFile,
    file,
  } = useFileHandler(type);

  const handleSelectType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    if (file) {
      parseFile(file);
    }
  }, [type, file, parseFile]);

  return (
    <Card variant="outlined">
      <Box sx={{ p: 4 }}>
        <Typography gutterBottom variant="h4">
          Pollum parser
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Conversão de arquivos de pagamentos e recebimentos.
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#373737" }} />
      <Box sx={{ p: 4 }}>
        <Stack direction={"column"}>
          <FormControl>
            <InputLabel id="select-label">Tipo</InputLabel>
            <Select
              labelId="select-label"
              value={type}
              label="Tipo"
              onChange={handleSelectType}
            >
              <MenuItem value={"payments"}>Pagamentos</MenuItem>
              <MenuItem value={"receipts"}>Recebimentos</MenuItem>
            </Select>
          </FormControl>
          <Box height={16} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {fileName
              ? `Arquivo selecionado: ${fileName}`
              : "Nenhum arquivo selecionado."}
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
