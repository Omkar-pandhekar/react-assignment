import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { fetchArtworks } from "../api/api";
import type { Artwork } from "../types";
import { selectionStore } from "../utils/selectionStore";
import { Button } from "primereact/button";

type Props = { initialRows?: number };

export default function ArtTable({ initialRows = 10 }: Props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRows);
  const [items, setItems] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Artwork[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchArtworks(page, rowsPerPage)
      .then((res) => {
        if (!mounted) return;
        setItems(res.items);
        setTotalRecords(res.total ?? res.items.length);
        const currentPageSelected = res.items.filter((item) =>
          selectionStore.isSelected(item.id)
        );
        setSelectedItems(currentPageSelected);
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [page, rowsPerPage]);

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelection = e.value ?? [];
    const prevIds = new Set(selectedItems.map((item) => item.id));
    const newIds = new Set(newSelection.map((item) => item.id));

    newSelection
      .filter((item) => !prevIds.has(item.id))
      .forEach((item) =>
        selectionStore.select({
          id: item.id,
          title: item.title ?? null,
          artist_display: item.artist_display ?? null,
        })
      );

    selectedItems
      .filter((item) => !newIds.has(item.id))
      .forEach((item) => selectionStore.deselect(item.id));

    setSelectedItems(newSelection);
  };

  // Selection actions
  const selectAllVisible = () => {
    selectionStore.bulkSelect(
      items.map((item) => ({
        id: item.id,
        title: item.title ?? null,
        artist_display: item.artist_display ?? null,
      }))
    );
    setSelectedItems(items);
  };

  const deselectAllVisible = () => {
    selectionStore.bulkDeselect(items.map((item) => item.id));
    setSelectedItems([]);
  };

  const clearAllSelection = () => {
    selectionStore.clear();
    setSelectedItems([]);
  };

  // Handle pagination changes
  const onPageChange = (event: { first: number; rows: number }) => {
    const newPage = Math.floor(event.first / event.rows) + 1;
    setRowsPerPage(event.rows);
    setPage(newPage);
  };

  // Get all selected items from store
  const allSelectedItems = selectionStore.getAll();

  return (
    <div className="w-full pt-10">
      <div className="flex gap-6 items-center pb-5">
        <Button
          label="Select all visible"
          severity="danger"
          onClick={selectAllVisible}
          className="bg-lime-600 px-3 py-2 text-white rounded-3xl"
        />
        <Button
          label="Deselect visible"
          onClick={deselectAllVisible}
          severity="secondary"
          className="bg-zinc-900 text-white rounded-3xl px-3 py-2"
        />
        <Button
          label="Clear all selections"
          onClick={clearAllSelection}
          className="bg-zinc-600 text-white rounded-3xl px-3 py-2"
        />
      </div>

      <div className="mb-3">
        <h1 className="text-md font-bold">
          {" "}
          Selected:{" "}
          <span className="text-md font-light">
            {allSelectedItems.length} item(s)
          </span>
        </h1>
      </div>

      <div className="w-full flex gap-10">
        <div className="flex-1">
          <DataTable
            value={items}
            paginator={false}
            loading={loading}
            selectionMode="multiple"
            selection={selectedItems}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            responsiveLayout="scroll"
            emptyMessage="No artworks found"
            header={`Page number :  ${page}`}
            showGridlines
            style={{
              paddingBottom: "1rem",
              width: "100%",
              minWidth: "800px",
            }}
          >
            <Column
              selectionMode="multiple"
              style={{
                width: "4rem",
                textAlign: "center",
              }}
              headerStyle={{
                textAlign: "center",
                padding: "16px 12px",
              }}
              bodyStyle={{
                textAlign: "center",
                padding: "16px 12px",
              }}
            />
            <Column
              field="title"
              header="Title"
              sortable
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
            <Column
              field="place_of_origin"
              header="Place of Origin"
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
            <Column
              field="artist_display"
              header="Artist"
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
            <Column
              field="date_start"
              header="Date Start"
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
            <Column
              field="date_end"
              header="Date End"
              headerStyle={{ textAlign: "center", padding: "16px 20px" }}
              bodyStyle={{ textAlign: "center", padding: "16px 20px" }}
            />
          </DataTable>

          <Paginator
            first={(page - 1) * rowsPerPage}
            rows={rowsPerPage}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </div>

        <aside className="w-72 bg-white p-3 rounded-lg shadow-sm">
          <h4>Selection Panel</h4>
          <div className="mb-2">
            <strong>{allSelectedItems.length}</strong> selected
          </div>
          <div className="max-h-144 overflow-y-auto">
            {allSelectedItems.length === 0 && <div>No items selected</div>}
            {allSelectedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-1.5 border-b border-gray-200"
              >
                <div className="text-xs">
                  <div className="font-semibold">{item.title ?? "—"}</div>
                  <div className="text-xs text-gray-600">
                    {item.artist_display ?? ""}
                  </div>
                </div>
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-sm"
                  onClick={() => {
                    selectionStore.deselect(item.id);
                    setSelectedItems((prev) =>
                      prev.filter((p) => p.id !== item.id)
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
