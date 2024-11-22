import { Result, Failure } from "@/lib/result";
import { convertGrupoMaxinutri } from "./grupo-maxinutri";
import { customers } from "@/lib/customers";

export const convert = (
  fileType: string,
  customer: string,
  fileContent: string
): Result<string, string> => {
  if (customer === customers.grupoMaxinutri) {
    return convertGrupoMaxinutri(fileType, fileContent);
  }
  return Failure(
    "Conversão não disponível para a combinação de tipo de arquivo e cliente"
  );
};
