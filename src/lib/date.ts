export const toInputDate = (v?: string | Date | null) => {
  if (!v) return '';
  return new Date(v).toISOString().slice(0, 10);
};

export const fmtDate = (v?: string | Date | null) => {
  if (!v) return '-';
  return new Date(v).toISOString().slice(0, 10);
};
