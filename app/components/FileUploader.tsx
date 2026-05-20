import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const maxFileSize = 5 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect?.(acceptedFiles[0] || null);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: ACCEPT,
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;
  const rejection = fileRejections[0]?.errors[0];

  return (
    <div
      {...getRootProps()}
      className={`uplader-drag-area w-full border-2 border-dashed transition-all duration-200 ${
        isDragActive
          ? "border-[#606beb] bg-[#f4f7fe] scale-[1.01]"
          : file
            ? "border-[#606beb]/40 bg-[#f4f7fe]/40"
            : "border-gray-200 hover:border-[#a7bff1] hover:bg-[#fafbff]"
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div
          className="uploader-selected-file !bg-white border border-[#c1d3f8]/60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-12 rounded-xl bg-[#f4f7fe] flex items-center justify-center shrink-0">
              <img src="/images/pdf.png" alt="" className="size-8" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-dark-200">{formatSize(file.size)} · Ready to analyze</p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            onClick={() => onFileSelect?.(null)}
            aria-label="Remove file"
          >
            <img src="/icons/cross.svg" alt="" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="py-2">
          <div className="size-14 mx-auto mb-4 rounded-2xl bg-[#f4f7fe] flex items-center justify-center">
            <img src="/icons/info.svg" alt="" className="size-8 opacity-80" />
          </div>
          <p className="text-gray-900 font-medium">
            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="text-sm text-dark-200 mt-1">
            or <span className="text-[#606beb] font-medium">browse files</span>
          </p>
          <p className="text-xs text-dark-200/70 mt-3">PDF or DOCX · max {formatSize(maxFileSize)}</p>
        </div>
      )}

      {rejection && (
        <p className="mt-4 text-sm text-[#752522] font-medium">
          {rejection.code === "file-too-large"
            ? "File exceeds 5 MB — try a smaller export."
            : "Please upload PDF or DOCX."}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
