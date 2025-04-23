"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button, Container, Grid, Typography } from "@mui/material";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import { FilePondFile, FilePondInitialFile } from "filepond";
import { useState } from "react";
import axios from "axios";
import JsonViewer from "@/components/JsonViewer";
import ResultTable from "@/components/ResultTable";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [output, setOutput] = useState<any>(null);
  console.log("files", files);

  const handleFileSubmit = async () => {
    setLoading(true);
    setOutput(null);
    try {
      console.log("current file", files[0]?.file);
      const formData = new FormData();
      formData.append("pdf", files[0]?.file);
      const { data } = await axios.post("/api/pdf-upload", formData);
      console.log("data", data);
      setOutput(data);
      setFiles([]);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Navbar />
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: "40px", backgroundColor: "#f5f5f5" }}
      >
        <Grid
          container
          justifyContent={"center"}
          alignContent={"center"}
          mt={8}
          spacing={3}
          pb={4}
        >
          <Grid
            container
            size={12}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <Grid size={6}>
              <FileUpload
                disabled={loading}
                files={files}
                setFiles={setFiles}
              />
            </Grid>
          </Grid>
          <Grid
            container
            size={12}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <Grid>
              <Button
                disabled={!files.length}
                onClick={handleFileSubmit}
                loading={loading}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          {loading && (
            <Grid
              container
              size={12}
              justifyContent={"center"}
              alignContent={"center"}
            >
              <Typography fontSize={14} sx={{ color: "black" }}>
                This may take a long time depending on the size of the PDF
              </Typography>
            </Grid>
          )}
          {output && <ResultTable data={output} />}
        </Grid>
      </Container>
    </Container>
  );
}
