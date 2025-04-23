"use client";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
const FileUpload = ({
  disabled = false,
  files,
  setFiles,
}: {
  disabled?: boolean;
  files: any;
  setFiles: any;
}) => {
  return (
    <FilePond
      disabled={disabled}
      allowMultiple={false}
      files={files}
      onupdatefiles={setFiles}
      server={null}
    />
  );
};

export default FileUpload;
