import { Avatar } from "@base-ui-components/react";
import {
	ComponentProps,
	ReactElement,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";

type FileInputProps = Omit<ComponentProps<"input">, "type">;
type FilesProps = FileList | null;
type WithFiles = { files: FilesProps };

export type FileUploadProps = FileInputProps & {
	children?: ReactElement<FileUploadPreviewProps, typeof FileUploadPreview>;
	onFileChange: (files: FilesProps) => void;
};

export type FileUploadPreviewProps = WithFiles & {
	className?: string;
} & ComponentProps<"div">;

export type FileUploadInfoProps = WithFiles &
	ComponentProps<"div"> & {
		pProps?: ComponentProps<"p">;
		children?: ReactNode;
	};

export type FileUploadRemoveFileBtnProps = ComponentProps<"button"> & {
	onFileRemove: (file: FilesProps) => void;
};

export type FileUploadDropzoneProps = {
	children?: ReactNode;
	onFileChange: (file: FilesProps) => void;
	className?: string;
} & ComponentProps<"input">;

export const FileUpload = ({
	children,
	onFileChange,
	className,
	...props
}: FileUploadProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files || null;
		onFileChange(file);
	};

	return (
		<div className="flex justify-center items-center gap-2">
			{children}
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				onChange={handleChange}
				{...props}
			/>
			<button
				className={twMerge(
					"px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200",
					className,
				)}
				onClick={() => inputRef.current?.click()}
			>
				Upload file
			</button>
		</div>
	);
};

export const FileUploadPreview = ({
	files,
	className,
	...props
}: FileUploadPreviewProps) => {
	const [textFallBack, setTextFallBack] = useState<string | null>(null);

	useEffect(() => {
		if (!files || files.length === 0) {
			setTextFallBack(null);
			return;
		}

		if (files.length > 1) {
			setTextFallBack(`+${files.length}`);
		} else {
			const extension = files[0].name.split(".").pop()?.toLowerCase() || "file";
			setTextFallBack(extension);
		}
	}, [files]);

	if (!files || files.length === 0) return <div className="hidden"></div>;

	return (
		<div
			className={twMerge(
				"flex size-10 items-center justify-center rounded-xl border border-gray-400 bg-gray-50 align-middle text-black text-sm font-medium",
				className,
			)}
			{...props}
		>
			<Avatar.Root>
				<Avatar.Image
					className="rounded-xl size-10"
					src={(files.length < 2 && URL.createObjectURL(files[0])) || undefined}
				/>
				<Avatar.Fallback>{textFallBack}</Avatar.Fallback>
			</Avatar.Root>
		</div>
	);
};

export const FileUploadInfo = ({
	pProps,
	files,
	className,
	children,
	...props
}: FileUploadInfoProps) => {
	const [fileName, setFileName] = useState<string | null>(null);

	useEffect(() => {
		if (!files || files.length === 0) return setFileName("No file selected");

		if (files.length > 1) {
			setFileName(`${files.length} files selected`);
		} else {
			const name = files[0].name;
			const shortName =
				name.length > 13
					? `${name.slice(0, 10)}...${name.slice(name.lastIndexOf("."))}`
					: name;
			setFileName(shortName);
		}
	}, [files]);

	return (
		<div className={twMerge("mt-2 flex gap-4", className)} {...props}>
			<p className={twMerge("dark:text-white", pProps?.className)} {...pProps}>
				{fileName}
			</p>
			{children}
		</div>
	);
};

export const FileUploadRemoveFileBtn = ({
	onFileRemove,
	className,
	...props
}: FileUploadRemoveFileBtnProps) => {
	return (
		<button
			className={twMerge(
				"cursor-pointer hover:underline text-red-800 font-semibold",
				className,
			)}
			onClick={() => onFileRemove(null)}
			{...props}
		>
			Remove
		</button>
	);
};

export const FileUploadDropzone = ({
	onFileChange,
	children,
	className,
	...props
}: FileUploadDropzoneProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragging, setIsDragging] = useState(true);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			onFileChange(files);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	return (
		<div
			className={twMerge(
				"w-full max-w-100 p-4 shadow-md border-gray-100 rounded-2xl space-y-4",
				className,
			)}
		>
			<div
				className="h-40 w-full px-4 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-2xl"
				onClick={() => inputRef.current?.click()}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragEnter={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<input
					ref={inputRef}
					type="file"
					className="hidden"
					onChange={(e) => onFileChange(e.target.files)}
					{...props}
				/>
				<p className="font-semibold">Choose a file </p>
				<p className="text-gray-500 text-sm">drag and drop it here</p>
			</div>
			<div className="flex flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
};
