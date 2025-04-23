## Overview
A single-page web application that allows users to upload PDF files containing plumbing schematics or specifications. Once uploaded, the application parses the PDF and generates a data table listing each part mentioned and the page numbers on which each part appears.

## Features
- 📄 **PDF Upload**: Users can upload a PDF document containing plumbing specifications.
- 🔍 **Part Extraction**: Automatically scans and detects parts from the document.
- 📑 **Page Mapping**: Identifies and lists the pages where each part is mentioned.
- 🧾 **Data Table Output**: Displays extracted data in a clean, easy-to-read data table.

## How It works
1. The user uploads a PDF file.
2. The app processes the PDF using Google Gemini.
3. It parses the PDF's contents for the following data:
   - **Item type**
   - **Quantity**
   - **Model number**
   - **Associated Dimensions**
   - **Mounting Type**
4. A data table is then generated displaying all the above mentioned fields along with each **Page number** where the part appeared

## Technologies Used
- **Frontend + Backend**: NextJS
- **PDF Parsing**: Google Gemini

## Video demo
https://github.com/user-attachments/assets/3e8f507f-80f7-436c-8585-bd17497f2fea


## Getting Started
Create a `.env` file in the root directory of the project with the following contents
```bash
GEMINI_API_KEY=<your-api-key>
```
Install the dependencies
```bash
npm install
```
Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

