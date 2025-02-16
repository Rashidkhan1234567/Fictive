import * as React from "react";
import { cn } from "../../lib/utils";


const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full border-collapse", className)} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("bg-gray-100", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("divide-y", className)} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr className={cn("border-b hover:bg-gray-50", className)} {...props} />
);

const TableHead = ({ className, ...props }) => (
  <th className={cn("px-4 py-2 text-left font-medium", className)} {...props} />
);

const TableCell = ({ className, ...props }) => (
  <td className={cn("px-4 py-2", className)} {...props} />
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
