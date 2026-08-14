import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

function EnquiryList({ enquiryList, loading, editEnquiry, deleteEnquiry, deletingId }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#0A2A92]">Enquiry List</h2>
        <span className="text-sm text-slate-500">
          {loading ? "" : `${enquiryList.length} record(s)`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="bg-[#0A2A92] text-white">Sr No.</TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">Name</TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">Email</TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">Phone</TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">Message</TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">
                <span className="sr-only">Edit</span>
              </TableHeadCell>
              <TableHeadCell className="bg-[#0A2A92] text-white">
                <span className="sr-only">Delete</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {loading ? (
              <TableRow className="bg-white">
                <TableCell colSpan={7}>
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <Spinner size="sm" className="mr-2" />
                    Loading enquiries...
                  </div>
                </TableCell>
              </TableRow>
            ) : enquiryList.length === 0 ? (
              <TableRow className="bg-white">
                <TableCell colSpan={7}>
                  <div className="py-8 text-center text-slate-500">
                    No enquiries found yet.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enquiryList.map((item, index) => (
                <TableRow
                  key={item._id}
                  className="bg-white hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="whitespace-nowrap font-semibold text-slate-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                  <TableCell className="text-slate-600">{item.email}</TableCell>
                  <TableCell className="text-slate-600">{item.phone}</TableCell>
                  <TableCell className="text-slate-600">{item.message}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      color="info"
                      onClick={() => editEnquiry(item)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      color="failure"
                      disabled={deletingId === item._id}
                      onClick={() => deleteEnquiry(item._id)}
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default EnquiryList;