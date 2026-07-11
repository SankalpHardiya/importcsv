// "use client";

// import { useState } from "react";
// import { ImportResult } from "@/types";
// import { CRM_FIELD_LABELS } from "@/utils/constants";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface ResultsDashboardProps {
//   result: ImportResult;
// }

// // Custom exact colors requested for the Status column
// const STATUS_STYLES: Record<string, string> = {
//   GOOD_LEAD_FOLLOW_UP: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", // Green
//   DID_NOT_CONNECT: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",       // Yellow
//   BAD_LEAD: "bg-red-500/20 text-red-400 border border-red-500/30",                       // Red
//   SALE_DONE: "bg-white/10 text-white border border-white/20",                           // White
// };

// export default function ResultsDashboard({ result }: ResultsDashboardProps) {
//   const { parsedRecords, skippedRecords, totalImported, totalSkipped } = result;
//   const [filter, setFilter] = useState<string>("all");

//   const activeFields = parsedRecords.length > 0 ? Object.keys(parsedRecords[0]).filter(key => parsedRecords.some(r => r[key as keyof typeof r])) : [];

//   const filteredRecords = filter === "all" ? parsedRecords : parsedRecords.filter(r => r.crm_status === filter);

//   return (
//     <div className="w-full space-y-6 pb-20">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <Card className="border-zinc-800 bg-zinc-900/50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-zinc-400">Successfully Imported</CardTitle>
//             <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-emerald-400">{totalImported}</div>
//           </CardContent>
//         </Card>
        
//         <Card className="border-zinc-800 bg-zinc-900/50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-zinc-400">Skipped Records</CardTitle>
//             <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-red-400">{totalSkipped}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Table Section */}
//       {parsedRecords.length > 0 && (
//         <Card className="border-zinc-800 bg-zinc-900/50">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-zinc-100">Mapped Records</CardTitle>
//             <Select onValueChange={setFilter} defaultValue="all">
//               <SelectTrigger className="w-[220px] bg-zinc-800 border-zinc-700 text-zinc-200">
//                 <SelectValue placeholder="Filter by Status" />
//               </SelectTrigger>
//               <SelectContent className="bg-zinc-900 border-zinc-800">
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="GOOD_LEAD_FOLLOW_UP">Good Lead Follow Up</SelectItem>
//                 <SelectItem value="DID_NOT_CONNECT">Did Not Connect</SelectItem>
//                 <SelectItem value="BAD_LEAD">Bad Lead</SelectItem>
//                 <SelectItem value="SALE_DONE">Sale Done</SelectItem>
//               </SelectContent>
//             </Select>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-lg border border-zinc-800 overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-b-zinc-800 hover:bg-transparent">
//                     <TableHead className="text-zinc-500">#</TableHead>
//                     {activeFields.map((field) => (
//                       <TableHead key={field} className="text-zinc-500 whitespace-nowrap">
//                         {CRM_FIELD_LABELS[field] || field}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredRecords.length === 0 ? (
//                     <TableRow className="hover:bg-transparent">
//                       <TableCell colSpan={activeFields.length + 1} className="h-24 text-center text-zinc-500">
//                         No records found for this filter.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredRecords.map((record, idx) => (
//                       <TableRow key={idx} className="border-b-zinc-800/50 hover:bg-zinc-800/30">
//                         <TableCell className="font-mono text-xs text-zinc-600">{idx + 1}</TableCell>
//                         {activeFields.map((field) => {
//                           const value = record[field as keyof typeof record];
                          
//                           // EXACT CUSTOM COLORS FOR STATUS COLUMN
//                           if (field === "crm_status" && value) {
//                             return (
//                               <TableCell key={field}>
//                                 <Badge 
//                                   variant="outline" 
//                                   className={`${STATUS_STYLES[value] || "border-zinc-700 text-zinc-400"} capitalize px-2.5 py-0.5 font-medium`}
//                                 >
//                                   {String(value).replace(/_/g, ' ').toLowerCase()}
//                                 </Badge>
//                               </TableCell>
//                             );
//                           }

//                           // Keep data source as purple
//                           if (field === "data_source" && value) {
//                             return (
//                               <TableCell key={field}>
//                                 <Badge variant="outline" className="border-violet-500/30 text-violet-400 bg-violet-500/10">{value}</Badge>
//                               </TableCell>
//                             );
//                           }
                          
//                           // Default text
//                           return (
//                             <TableCell key={field} className="text-zinc-300 max-w-[200px] truncate" title={String(value ?? "")}>
//                               {value || <span className="text-zinc-700">—</span>}
//                             </TableCell>
//                           );
//                         })}
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Skipped Accordion */}
//       {skippedRecords.length > 0 && (
//         <Card className="border-zinc-800 bg-zinc-900/50">
//           <CardHeader>
//             <CardTitle className="text-zinc-100">Skipped Records ({skippedRecords.length})</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {skippedRecords.map((skipped, idx) => (
//               <details key={idx} className="group rounded-lg border border-zinc-800">
//                 <summary className="flex cursor-pointer items-center justify-between p-4 text-sm text-zinc-400 hover:bg-zinc-800/50 transition-colors">
//                   <span>{skipped.reason}</span>
//                   <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//                 </summary>
//                 <div className="border-t border-zinc-800 p-4">
//                   <pre className="text-xs text-zinc-500 bg-zinc-950 p-4 rounded-md overflow-x-auto font-mono">
//                     {JSON.stringify(skipped.originalData, null, 2)}
//                   </pre>
//                 </div>
//               </details>
//             ))}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { ImportResult } from "@/types";
import { CRM_FIELD_LABELS } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsDashboardProps {
  result: ImportResult;
}

const STATUS_STYLES: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30", 
  DID_NOT_CONNECT: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",       
  BAD_LEAD: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",                       
  SALE_DONE: "bg-foreground/10 text-foreground border border-foreground/20",                           
};

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { parsedRecords, skippedRecords, totalImported, totalSkipped } = result;
  const [filter, setFilter] = useState<string>("all");

  const activeFields = parsedRecords.length > 0 ? Object.keys(parsedRecords[0]).filter(key => parsedRecords.some(r => r[key as keyof typeof r])) : [];
  const filteredRecords = filter === "all" ? parsedRecords : parsedRecords.filter(r => r.crm_status === filter);

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successfully Imported</CardTitle>
            <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{totalImported}</div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Skipped Records</CardTitle>
            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{totalSkipped}</div>
          </CardContent>
        </Card>
      </div>

      {parsedRecords.length > 0 && (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Mapped Records</CardTitle>
            <Select onValueChange={setFilter} defaultValue="all">
              <SelectTrigger className="w-[220px] bg-secondary border-border text-foreground">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="GOOD_LEAD_FOLLOW_UP">Good Lead Follow Up</SelectItem>
                <SelectItem value="DID_NOT_CONNECT">Did Not Connect</SelectItem>
                <SelectItem value="BAD_LEAD">Bad Lead</SelectItem>
                <SelectItem value="SALE_DONE">Sale Done</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">#</TableHead>
                    {activeFields.map((field) => (
                      <TableHead key={field} className="text-muted-foreground whitespace-nowrap">
                        {CRM_FIELD_LABELS[field] || field}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={activeFields.length + 1} className="h-24 text-center text-muted-foreground">
                        No records found for this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record, idx) => (
                      <TableRow key={idx} className="border-b-border/50 hover:bg-accent/50">
                        <TableCell className="font-mono text-xs text-muted-foreground/50">{idx + 1}</TableCell>
                        {activeFields.map((field) => {
                          const value = record[field as keyof typeof record];
                          
                          if (field === "crm_status" && value) {
                            return (
                              <TableCell key={field}>
                                <Badge 
                                  variant="outline" 
                                  className={`${STATUS_STYLES[value] || "border-border text-muted-foreground"} capitalize px-2.5 py-0.5 font-medium`}
                                >
                                  {String(value).replace(/_/g, ' ').toLowerCase()}
                                </Badge>
                              </TableCell>
                            );
                          }

                          if (field === "data_source" && value) {
                            return (
                              <TableCell key={field}>
                                <Badge variant="outline" className="border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10">{value}</Badge>
                              </TableCell>
                            );
                          }
                          
                          return (
                            <TableCell key={field} className="text-foreground/80 max-w-[200px] truncate" title={String(value ?? "")}>
                              {value || <span className="text-muted-foreground/30">—</span>}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {skippedRecords.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Skipped Records ({skippedRecords.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skippedRecords.map((skipped, idx) => (
              <details key={idx} className="group rounded-lg border border-border">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm text-muted-foreground hover:bg-accent/50 transition-colors">
                  <span>{skipped.reason}</span>
                  <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="border-t border-border p-4">
                  <pre className="text-xs text-muted-foreground bg-secondary p-4 rounded-md overflow-x-auto font-mono">
                    {JSON.stringify(skipped.originalData, null, 2)}
                  </pre>
                </div>
              </details>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}