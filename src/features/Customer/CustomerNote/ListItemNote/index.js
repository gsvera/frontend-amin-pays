import { formatDate } from "@/utils/DateUtils";
import { FORMAT_DATE } from "@/config/constants";
import "./index.scss";
import { Row } from "antd";

export default function ListItemNote({ note }) {
  return (
    <div className="list-item-note">
      <div className="note-date">
        {formatDate(note?.createdAt, FORMAT_DATE.GENERAL_FORMAT_DATE_TIME)}
      </div>
      <Row className="text-note">
        <div dangerouslySetInnerHTML={{ __html: note?.note }}></div>
      </Row>
      <span className="label-user-note">
        User: {note?.nameUserCreated ?? ""}
      </span>
    </div>
  );
}
