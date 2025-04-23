import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import PDFParser from "pdf2json";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
} from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json("I'm alive", { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message ?? "Health check failed",
      },
      { status: 500 }
    );
  }
}

const validateFileUpload = async (formData: FormData) => {
  if (!formData || !formData.get("pdf")) {
    console.log("no pdf");
    throw new Error("Missing PDF field");
  }

  const uploadedPdf = formData.get("pdf") as File;

  return uploadedPdf;
};

const attemptJsonRepair = async (responseText: string) => {
  const repairedJson = jsonrepair(responseText);
  return JSON.parse(repairedJson);
};

const parseGeminiResponse = (responseText: string) => {
  try {
    return JSON.parse(responseText);
  } catch (error: any) {
    // Gemini returns broken JSON sometimes for whatever reason
    console.log("Error parsing JSON, attempting repair...");
    return attemptJsonRepair(responseText);
  }
};

const uploadPdfToGemini = async (initialPdf: File) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Uploading PDF...");
  const uploadedPdf = await ai.files.upload({
    file: initialPdf,
    config: { mimeType: "application/pdf" },
  });

  if (!uploadedPdf || !uploadedPdf?.uri || !uploadedPdf?.mimeType) {
    throw new Error("Unable to upload PDF");
  }

  console.log("PDF successfully uploaded, performing analysis...");
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      `You are a civil engineering expert. Go through the attached PDF and be as detailed as possible. Provide a response with the following: 
      1. Item/Fixture Types
      2. Quantities
      3. Model Numbers / Spec References
      4. Page References
      5. Mounting Type
      6. Associated Dimensions (if any)
     `,
      createPartFromUri(uploadedPdf.uri, uploadedPdf.mimeType),
    ]),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            itemType: {
              type: Type.STRING,
              description: "Item/Fixture Types",
              nullable: false,
            },
            quantity: {
              type: Type.NUMBER,
              description: "Quantity",
            },
            modelNumber: {
              type: Type.STRING,
              description: "Model Number / Spec Reference",
            },
            pageNumber: {
              type: Type.NUMBER,
              description: "Page Reference",
            },
            associatedDimensions: {
              type: Type.STRING,
              description: "Associated Dimensions - Diameter",
            },
            mountingType: {
              type: Type.STRING,
              description: "Mounting Type",
            },
          },
          required: [
            "itemType",
            "quantity",
            "modelNumber",
            "pageNumber",
            "associatedDimensions",
            "mountingType",
          ],
        },
      },
    },
  });

  if (!response?.text) {
    throw new Error("Unable to produce JSON");
  }

  return parseGeminiResponse(response.text);
};

const cleanResults = (result: any[]) => {
  return result
    .filter(
      (item) =>
        item?.modelNumber && item?.pageNumber && item?.modelNumber !== "N/A"
    )
    .map((filteredResult) => ({
      ...filteredResult,
      itemType: filteredResult?.itemType ?? "N/A",
      quantity: filteredResult?.quantity ?? "N/A",
      associatedDimensions: filteredResult?.associatedDimensions ?? "N/A",
      mountingType: filteredResult?.mountingType ?? "N/A",
      id: uuidv4(),
    }))
    .sort((a, b) => a?.pageNumber - b?.pageNumber);
};

const parsePdf = async (uploadedPdf: File) => {
  let pdfJson = {};
  const currentTimestamp = new Date().getTime();
  const tempFilePath = `/tmp/${currentTimestamp}.pdf`;

  const fileBuffer = Buffer.from(await uploadedPdf.arrayBuffer());
  await fs.writeFile(tempFilePath, fileBuffer);
  const pdfParser = new PDFParser(null, true);

  pdfParser.on("pdfParser_dataError", (errData: any) => {
    console.log(errData.parserError);
    throw new Error("Unable to initialized PDF Parser");
  });
  pdfParser.on("pdfParser_dataReady", (pdfData) => {
    pdfJson = pdfData;
  });

  await new Promise((resolve, reject) => {
    pdfParser.loadPDF(tempFilePath);
    pdfParser.on("pdfParser_dataReady", resolve);
    pdfParser.on("pdfParser_dataError", reject);
  });

  return pdfJson;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const initialPdf = await validateFileUpload(formData);

    // this is a very slow and time-consuming parsing process
    // use at your own discretion
    // const parsedPdf = await parsePdf(initialPdf);
    // console.log("parsedPdf", parsedPdf);

    const response = await uploadPdfToGemini(initialPdf);

    const result = cleanResults(response);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json(
      {
        message: error?.message ?? "Unable to process your PDF",
      },
      { status: 500 }
    );
  }
}
