import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectContent,
} from "../../ui/select";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Check, Copy, Download } from "lucide-react";
import { useBlockEditor } from "@/hooks/use-block-editor";
import { type Article } from "@prisma/client";
import { useState } from "react";

export function ExportButton({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [exportType, setExportType] = useState<"prose-mirror" | "html">(
    "prose-mirror",
  );
  const { editor } = useBlockEditor({ article });

  const getContent = (): string => {
    if (!editor) return "";

    switch (exportType) {
      case "prose-mirror":
        return JSON.stringify(editor.getJSON());

      case "html":
        return editor.getHTML();
    }
  };

  const onCopy = () => {
    setCopied(true);
    void navigator.clipboard.writeText(getContent());
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onDownload = () => {
    setDownloaded(true);
    const content = getContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title}.${exportType === "prose-mirror" ? "json" : exportType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="thin">Export</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Export as</Label>
            <Select
              value={exportType}
              onValueChange={(value) =>
                setExportType(value as "prose-mirror" | "html")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="prose-mirror">Prose Mirror</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                className="flex w-full gap-2"
                size="sm"
                variant="outline"
                onClick={onCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                className="flex w-full gap-2"
                size="sm"
                onClick={onDownload}
              >
                {downloaded ? (
                  <>
                    <Check className="h-4 w-4" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button disabled>Export to Dev.to</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
