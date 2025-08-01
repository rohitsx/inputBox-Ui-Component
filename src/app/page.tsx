"use client";

import {
  FileUploadWrapper,
  FileUpload,
  FileUploadInfo,
  FileUploadRemoveFileBtn,
  FileUploadPreview,
  FileUploadDropzone,
} from "@/component/file-upload";
import { ToggleTheme } from "@/component/toggel-theme";
import { useThemeStore } from "@/store/useThemeStore";
import { useState } from "react";

export default function Home() {
  const { theme } = useThemeStore();
  const [files, setFiles] = useState<FileList | null>(null);
  return (
    <div className={`h-screen dark:bg-black card  ${theme}`}>
      <div className="mt-4 space-y-10">
        <ToggleTheme />
        <FileUploadDropzone onFileChange={setFiles}>
          <FileUploadWrapper>
            <FileUpload onFileChange={setFiles}>
              {<FileUploadPreview files={files} />}
            </FileUpload>
            <FileUploadInfo files={files}>
              <FileUploadRemoveFileBtn onFileRemove={setFiles} />
            </FileUploadInfo>
          </FileUploadWrapper>
        </FileUploadDropzone>
      </div>
    </div>
  );
}
