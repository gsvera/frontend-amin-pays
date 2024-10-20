import Button from "@/components/Button";
import { Input, List } from "antd";
import apiCustomerNote from "@/api/services/apiCustomerNote";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/UseNotification";
import { useState, useMemo, useEffect } from "react";
import { REACT_QUERY_KEYS } from "@/config/react-query-keys";
import ListItemNote from "./ListItemNote";
import CustomAntEmpty from "@/components/CustomAntEmpty";
import { HasAccessPermission } from "@/hooks/HasAccessPermission";
import { PROFILE_PERMISSIONS } from "@/config/constants";

export default function CustomerNote({ user, customer }) {
  const { openErrorNotification, openSuccessNotification } = useNotification();
  const queryClient = useQueryClient();
  const [localValueNote, setLocalValueNote] = useState("");
  const { hasAccess } = HasAccessPermission();

  const permissionToAddNote = useMemo(
    () => hasAccess(PROFILE_PERMISSIONS.ADD_NOTE_CUSTOMER),
    [hasAccess]
  );

  const { data: noteList = [] } = useQuery({
    queryKey: REACT_QUERY_KEYS.customerNote.getByCustomer(customer?.id),
    queryFn: () => apiCustomerNote.getByCustomer(customer?.id),
    ...{
      select: (data) => data?.data?.items,
    },
    enabled: !!customer?.id,
  });

  const { mutate: saveNote } = useMutation({
    mutationFn: (data) => apiCustomerNote.save(data),
    onSuccess: (data) => handleSuccesSaveNote(data?.data),
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const disabledButton = useMemo(
    () =>
      localValueNote.length === 0 ||
      localValueNote.trim() === "" ||
      !customer?.id,
    [localValueNote, customer]
  );

  const handleSuccesSaveNote = (data) => {
    if (!data?.error) {
      queryClient.invalidateQueries([
        REACT_QUERY_KEYS.customerNote.getByCustomer(customer?.id),
      ]);
      openSuccessNotification(data?.message);
      setLocalValueNote("");
    } else {
      openErrorNotification(data?.message);
    }
  };

  const handleSubmitNote = () => {
    saveNote({
      idCustomer: customer?.id,
      idUser: user?.id,
      nameUserCreated: `${user?.firstName} ${user?.lastName}`,
      note: localValueNote.trim(),
    });
  };

  useEffect(() => {
    /**
     * Esta funcion es para hacer que el scroll de la lista se vaya hacia abajo para que las notas se lean de abajo hacia arriba simulando el estilo de los mensaje de texto
     */
    const elementList = document.querySelectorAll(".list-note");
    elementList?.forEach(function (element) {
      element.scrollTop = element.scrollHeight;
    });
  }, [noteList]);

  return (
    <div className="customer-note-add">
      <div className="title-note">Notas del cliente</div>
      <div style={{ height: `${permissionToAddNote ? "60%" : "100%"}` }}>
        <List
          className="list-note"
          dataSource={noteList}
          renderItem={(item) => <ListItemNote note={item} />}
          locale={{
            emptyText: customer ? (
              <CustomAntEmpty type="error" msg="No se encontraron notas" />
            ) : (
              <div></div>
            ),
          }}
        />
      </div>
      {permissionToAddNote && (
        <div>
          <Input.TextArea
            className="input-note"
            rows={5}
            maxLength={5000}
            showCount
            style={{ marginBottom: "25px", border: "1px solid black" }}
            onChange={(e) => setLocalValueNote(e.target.value)}
            value={localValueNote}
            disabled={!customer?.id}
          />
          <Button
            text="Guardar"
            className="btn-add btn-long"
            onClick={handleSubmitNote}
            disabled={disabledButton}
          />
        </div>
      )}
    </div>
  );
}
