"use client";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { ActualFileObject, FilePondFile, FilePondInitialFile } from "filepond";
import { Dispatch, SetStateAction } from "react";

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
