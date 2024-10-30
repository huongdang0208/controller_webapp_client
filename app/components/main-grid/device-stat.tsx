import { Command } from "@/app/utils/interfaces/command.interface";
import { Device } from "@/app/utils/interfaces/device.interface";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React from "react";

interface Column {
  id: "date" | "device_name" | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  id: number;
  date: Date;
  device_name: string;
  action: string;
}

export default function DeviceStat({
  device,
  commandsByDevice,
}: {
  device: Device;
  commandsByDevice: Command[];
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const columns: readonly Column[] = [
    { id: "date", label: "Date", minWidth: 170 },
    { id: "device_name", label: "Device Name", minWidth: 100 },
    {
      id: "action",
      label: "Action",
      minWidth: 170,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
  ];
  const createData = (
    id: number,
    date: Date,
    device_name: string,
    action: string
  ): Data => {
    return { id, date, device_name, action };
  };

  const rows = commandsByDevice?.map((command) =>
    createData(
      command.id,
      new Date(command.created_at),
      device.device_name,
      command.command
    )
  );
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    color: "#333",
                    backgroundColor: "white !important",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value instanceof Date
                            ? value.toLocaleString()
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
