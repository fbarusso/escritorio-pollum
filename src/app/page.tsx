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
import { fileTypes } from "@/lib/file-types";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [fileType, setFileType] = useState("");
  const [customer, setCustomer] = useState("");
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isFileConverted, setIsFileConverted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isFormValid = () => {
    return fileType !== "" && customer !== "" && fileContent !== null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsText(selectedFile);
    }
  };

  const onClickConvert = () => {
    console.log(fileType, customer);
    const result = convert(fileType, customer, fileContent as string);

    if (result.success) {
      setIsFileConverted(true);
      toast.success("Arquivo convertido com sucesso");
    } else {
      toast.error(result.error);
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

  const onClickConvertAgain = () => {
    setIsFileConverted(false);
    setFileType("");
    setCustomer("");
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
                <span className="font-bold">Arquivo convertido:</span> teste
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClickConvertAgain}>
              Converter outro arquivo
            </Button>
            <Button>Download</Button>
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
