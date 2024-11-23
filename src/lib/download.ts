import { toast } from "sonner";

export const download = (filename: string, content: string): void => {
  try {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "convertido_" + filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.error(`Erro ao fazer o download do arquivo convertido: ${error}`);
  }
};
