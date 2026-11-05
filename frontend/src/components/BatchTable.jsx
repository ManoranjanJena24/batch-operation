import { MoreVertical } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(`${dateString}T00:00:00`));
}

export default function BatchTable({ batches }) {
  return (
    <div className="table-scroll">
      <table>
        <thead><tr>
          <th>Batch Code</th><th>Course</th><th>Centre</th><th>Start Date</th><th>Capacity</th><th>Status</th><th className="actions-heading">Actions</th>
        </tr></thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td><span className="batch-code">{batch.batchCode}</span></td>
              <td className="course-cell">{batch.courseName}</td>
              <td>{batch.centreName}</td>
              <td>{formatDate(batch.startDate)}</td>
              <td><span className="capacity-value">{batch.enrolled}</span><span className="capacity-total">/{batch.capacity}</span></td>
              <td><StatusBadge status={batch.status} /></td>
              <td className="actions-cell"><button className="icon-button" aria-label={`Actions for ${batch.batchCode}`} title="Actions are not enabled in this assessment"><MoreVertical size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
