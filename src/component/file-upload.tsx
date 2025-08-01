import { Input, Avatar } from "@base-ui-components/react";
import { ComponentProps, ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type FileInputProps = Omit<ComponentProps<"input">, "type">;
type FilesProps = FileList | null;

export const FileUploadWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

type FileUploadPreviewProps = {
  files: FilesProps;
  pProps?: ComponentProps<"p">;
  children?: ReactNode;
} & ComponentProps<"div">;

export const FileUpload = ({
  children,
  onFileChange,
  className,
  ...props
}: {
  childern?: ReactNode;
  onFileChange: (files: FilesProps) => void;
} & FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files || null;
    onFileChange(file);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {children}
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        {...props}
      />
      <button
        className={twMerge(
          "border px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black",
          className,
        )}
        onClick={() => inputRef.current?.click()}
      >
        Upload file
      </button>
    </div>
  );
};

export const FileUploadInfo = ({
  pProps,
  files,
  className,
  children,
  ...props
}: FileUploadPreviewProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!files) return setFileName("No file selected");

    setFileName(files.length > 1 ? `${files.length} selected` : files[0].name);
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
}: {
  onFileRemove: (file: FilesProps) => void;
} & ComponentProps<"button">) => {
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

export const FileUploadPreview = ({ files }: { files: FilesProps }) => {
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

  if (!files) return <div className="hidden"></div>;

  return (
    <Avatar.Root className="inline-flex size-11 items-center justify-center rounded-full bg-gray-100 align-middle text-base font-medium text-black select-none">
      <Avatar.Image src={URL.createObjectURL(files[0])} />
      <Avatar.Fallback className={"text-sm"}>{textFallBack}</Avatar.Fallback>
    </Avatar.Root>
  );
};

export const FileUploadDropzone = ({
  onFileChange,
  children,
}: {
  onFileChange: (file: FilesProps) => void;
  children: ReactNode;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
      className={`bg-gray-50 border h-60 w-100 rounded-2xl transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-black"
      }`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files)}
      />
      <div className="h-40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-semibold">
          Choose a file or drag and drop it here
        </h1>
        {isDragging && <p className="text-blue-600">Drop your file now</p>}
      </div>
      <div className="h-20">{children}</div>
    </div>
  );
};
