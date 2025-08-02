"use client";

import {
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
			<div className="mt-4 w-full space-y-10 px-8 flex flex-col items-center">
				<ToggleTheme />
				<FileUploadDropzone onFileChange={setFiles} multiple>
					<FileUpload onFileChange={setFiles}>
						<FileUploadPreview files={files} />
					</FileUpload>
					<FileUploadInfo files={files}>
						<FileUploadRemoveFileBtn onFileRemove={setFiles} />
					</FileUploadInfo>
				</FileUploadDropzone>
			</div>
		</div>
	);
}
