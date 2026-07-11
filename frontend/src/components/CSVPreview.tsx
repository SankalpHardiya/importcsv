"use client";

import { CSVParsedData } from "@/types";
import { MAX_PREVIEW_ROWS } from "@/utils/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CSVPreviewProps {
  data: CSVParsedData;
}

export default function CSVPreview({ data }: CSVPreviewProps) {
  const { headers, rows, totalRows } = data;
  const displayRows = rows.slice(0, MAX_PREVIEW_ROWS);
  const isTruncated = totalRows > MAX_PREVIEW_ROWS;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow className="border-b-border hover:bg-transparent">
              <TableHead className="text-muted-foreground w-12">#</TableHead>
              {headers.map((header, index) => (
                <TableHead key={index} className="text-muted-foreground whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b-border/50 hover:bg-accent/50">
                <TableCell className="font-mono text-xs text-muted-foreground/50">{rowIndex + 1}</TableCell>
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex} className="text-foreground/80 whitespace-nowrap max-w-[250px] truncate" title={String(row[header] ?? "")}>
                    {row[header] || <span className="text-muted-foreground/30">—</span>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isTruncated && (
        <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
          Previewing first {MAX_PREVIEW_ROWS} of {totalRows} rows. Full data will be processed.
        </div>
      )}
    </div>
  );
}