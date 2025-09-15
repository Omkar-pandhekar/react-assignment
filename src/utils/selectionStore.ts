// selectionStore.ts
type SelItem = {
  id: number;
  title?: string | null;
  artist_display?: string | null;
  // you may include small fields to show in panel
};

const KEY = "art_selection_v1";

function readStore(): Record<number, SelItem> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, SelItem>;
  } catch {
    return {};
  }
}

function writeStore(obj: Record<number, SelItem>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch {}
}

export const selectionStore = {
  getAll(): SelItem[] {
    const obj = readStore();
    return Object.values(obj);
  },
  isSelected(id: number): boolean {
    const obj = readStore();
    return !!obj[id];
  },
  select(item: SelItem) {
    const obj = readStore();
    obj[item.id] = item;
    writeStore(obj);
  },
  deselect(id: number) {
    const obj = readStore();
    delete obj[id];
    writeStore(obj);
  },
  clear() {
    writeStore({});
  },
  bulkSelect(items: SelItem[]) {
    const obj = readStore();
    items.forEach((i) => (obj[i.id] = i));
    writeStore(obj);
  },
  bulkDeselect(ids: number[]) {
    const obj = readStore();
    ids.forEach((id) => delete obj[id]);
    writeStore(obj);
  },
};
