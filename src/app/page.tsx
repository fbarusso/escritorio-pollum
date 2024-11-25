"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convert } from "@/lib/converters/converter";
import { customers } from "@/lib/customers";
import { download } from "@/lib/download";
import { fileTypes } from "@/lib/file-types";
import chardet from "chardet";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [fileType, setFileType] = useState("");
  const [customer, setCustomer] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [convertedFileContent, setConvertedFileContet] = useState<
    string | null
  >(null);
  const [isFileConverted, setIsFileConverted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isFormValid = () => {
    return fileType !== "" && customer !== "" && fileContent !== null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        setFileName(selectedFile.name);

        const arrayBuffer = await selectedFile.arrayBuffer();
        const binaryData = new Uint8Array(arrayBuffer);
        const detectedEncoding = chardet.detect(Buffer.from(binaryData));
        const decoder = new TextDecoder(detectedEncoding || "utf-8");
        const fileContent = decoder.decode(binaryData);

        setFileContent(fileContent);
      } catch (error) {
        toast.error(`Erro ao processar o arquivo selecionado: ${error}`);
      }
    } else {
      toast.error("Erro ao processar o arquivo selecionado.");
    }
  };

  const onClickClear = () => {
    setFileType("");
    setCustomer("");
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Formulário limpo");
  };

  const onClickConvert = () => {
    if (fileContent) {
      const result = convert(fileType, customer, fileContent);
      if (result.success) {
        setIsFileConverted(true);
        setConvertedFileContet(result.value);
        toast.success("Arquivo convertido com sucesso");
      } else {
        toast.error(result.error);
      }
    } else {
      toast.error("Erro ao converter o arquivo");
    }
  };

  const onClickConvertAgain = () => {
    setIsFileConverted(false);
    setFileType("");
    setCustomer("");
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onClickDonwload = () => {
    if (fileName && convertedFileContent) {
      download(fileName, convertedFileContent);
    } else {
      toast.error("Erro ao fazer o download do arquivo convertido");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {isFileConverted ? (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Arquivo convertido
                </h4>
                {fileType === fileTypes.payments ? (
                  <Badge className="bg-teal-500">Pagamentos</Badge>
                ) : (
                  <Badge className="bg-orange-500">Recebimentos</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>
                <span className="font-bold">Tipo de arquivo:</span> {fileType}
              </li>
              <li>
                <span className="font-bold">Cliente:</span> {customer}
              </li>
              <li>
                <span className="font-bold">Arquivo convertido:</span>{" "}
                convertido_{fileName}
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClickConvertAgain}>
              Converter outro arquivo
            </Button>
            <Button onClick={onClickDonwload}>Download</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Conversor Pollum</CardTitle>
            <CardDescription>
              Conversão de arquivos de pagamentos e recebimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file-type">Tipo de arquivo</Label>
                  <Select
                    value={fileType}
                    onValueChange={(value) => setFileType(value)}
                  >
                    <SelectTrigger id="file-type">
                      <SelectValue placeholder={fileType || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(fileTypes).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file-type">Cliente</Label>
                  <Select
                    value={customer}
                    onValueChange={(value) => setCustomer(value)}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder={customer || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(customers).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClickClear}>
              Limpar
            </Button>
            <Button onClick={onClickConvert} disabled={!isFormValid()}>
              Converter
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
