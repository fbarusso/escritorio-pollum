import { fileTypes } from "@/lib/file-types";
import { Failure, Result, Success } from "@/lib/result";

const SEPARATOR = ";";

export const convertGrupoMaxinutri = (
  fileType: string,
  fileContent: string
): Result<string, string> => {
  return fileType === fileTypes.payments
    ? payments(fileContent)
    : receipts(fileContent);
};

const payments = (fileContent: string): Result<string, string> => {
  try {
    const lines = fileContent.split("\n");
    const convertedLines: string[] = [];

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
      outputValues5100[1] =
        outputValues5100[1] === "52" ? "39" : outputValues5100[1];
      outputValues5100[3] = inputValues5100[3] || "0";
      outputValues5100[11] = inputValues5100[11] || "0,00";
      outputValues5100[19] = inputValues5110[9] || "";

      // Copy values from input 5110
      for (let index = 0; index < 9; index++) {
        outputValues5110[index] = inputValues5110[index] || "";
      }

      // Set specific values for 5110
      outputValues5110[2] = "2077";
      outputValues5110[8] = "";

      // Construct the output lines
      const outputLine5100 =
        SEPARATOR + outputValues5100.join(SEPARATOR) + SEPARATOR + "\n";
      const outputLine5110 =
        SEPARATOR + outputValues5110.join(SEPARATOR) + SEPARATOR + "\n";

      // Add converted lines to the array
      convertedLines.push(outputLine5100, outputLine5110);
      const convertedContent = convertedLines.join("");
      return Success(convertedContent);
    }
  } catch (error) {
    return Failure(
      "Erro ao converter o arquivo de pagamentos para o GrupoMaxinutri"
    );
  }
  return Failure(
    "Erro ao converter o arquivo de pagamentos para o GrupoMaxinutri"
  );
};

const receipts = (fileContent: string): Result<string, string> => {
  try {
    const lines = fileContent.split("\n");
    const convertedLines: string[] = [];

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

      // Construct the output lines
      const outputLine5200 =
        SEPARATOR + outputValues5200.join(SEPARATOR) + SEPARATOR + "\n";
      const outputLine5210 =
        SEPARATOR + outputValues5210.join(SEPARATOR) + SEPARATOR + "\n";

      // Add modified lines to the array
      convertedLines.push(outputLine5200, outputLine5210);
      const convertedContent = convertedLines.join("");
      return Success(convertedContent);
    }
  } catch (error) {
    return Failure(
      "Erro ao converter o arquivo de recebimentos para o GrupoMaxinutri"
    );
  }
  return Failure(
    "Erro ao converter o arquivo de recebimentos para o GrupoMaxinutri"
  );
};
