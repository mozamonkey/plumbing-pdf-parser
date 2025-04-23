import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ResultTable = ({ data }: { data: any[] }) => {
  const columns: GridColDef[] = [
    { field: "pageNumber", headerName: "Page Number", flex: 1 },
    { field: "itemType", headerName: "Item Type", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "modelNumber", headerName: "Model Number", flex: 1 },
    {
      field: "associatedDimensions",
      headerName: "Associated Dimensions",
      flex: 1,
    },
    { field: "mountingType", headerName: "Mounting Type", flex: 1 },
  ];

  return <DataGrid columns={columns} rows={data} />;
};

export default ResultTable;
